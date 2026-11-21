#!/usr/bin/env python3
"""APEXQUANT-OS V2 — servidor do paper-trading real.

Uso:
    python3 server.py            # sobe em http://0.0.0.0:8000

API (JSON):
    GET  /api/state              estado completo (preços, posições, risco, log)
    GET  /api/candles?symbol=BTCUSDT&limit=50
    POST /api/order   {"symbol":"BTCUSDT","side":"BUY"|"SELL"}
    POST /api/close   {"id":"pos-..."}
    POST /api/close-all
    POST /api/auto    {"on":true|false}
    POST /api/backtest {"symbol":"BTCUSDT"}  (opcional)
    GET  /api/backtests

Sem dependências externas: apenas a biblioteca padrão do Python 3.10+.
"""
from __future__ import annotations

import json
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

from apex import config
from apex.backtest import run_backtest
from apex.engine import Engine

WEB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
engine = Engine()


class Handler(BaseHTTPRequestHandler):
    server_version = "APEXQUANT-OS/2.0"

    # --- helpers ----------------------------------------------------------
    def _json(self, payload, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _body(self) -> dict:
        length = int(self.headers.get("Content-Length") or 0)
        if length == 0:
            return {}
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except Exception:
            return {}

    def log_message(self, fmt, *args):  # silencia o log padrão
        pass

    # --- rotas ------------------------------------------------------------
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/state":
            return self._json(engine.state())
        if path == "/api/candles":
            qs = parse_qs(parsed.query)
            symbol = (qs.get("symbol") or [config.PRIMARY_SYMBOL])[0]
            limit = int((qs.get("limit") or ["50"])[0])
            return self._json({"candles": engine.get_candles(symbol, limit)})
        if path == "/api/backtests":
            return self._json({"backtests": engine.store.backtests()})
        if path == "/" or path == "/index.html":
            return self._serve_file("index.html")
        return self._json({"error": "não encontrado"}, 404)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        body = self._body()
        try:
            if path == "/api/order":
                symbol = str(body.get("symbol") or config.PRIMARY_SYMBOL)
                side = str(body.get("side") or "BUY").upper()
                if symbol not in config.SYMBOLS:
                    return self._json({"error": f"símbolo inválido: {symbol}"}, 400)
                if side not in ("BUY", "SELL"):
                    return self._json({"error": "side deve ser BUY ou SELL"}, 400)
                pos = engine.open_position(symbol, side, manual=True)
                return self._json({"ok": True, "position": pos})
            if path == "/api/close":
                pos = engine.close_position(str(body.get("id") or ""))
                return self._json({"ok": True, "position": pos})
            if path == "/api/close-all":
                n = engine.close_all()
                return self._json({"ok": True, "closed": n})
            if path == "/api/auto":
                on = bool(body.get("on"))
                engine.store.set_auto(on)
                engine.store.log("sistema", f"Modo automático {'ATIVADO' if on else 'DESATIVADO'}.")
                return self._json({"ok": True, "auto": on})
            if path == "/api/backtest":
                symbol = str(body.get("symbol") or config.PRIMARY_SYMBOL)
                candles = engine.get_candles(symbol, config.CANDLE_LIMIT)
                result = run_backtest(candles, symbol)
                engine.store.add_backtest(result)
                engine.store.log(
                    "backtest",
                    f"Backtest {symbol}: {result['trades']} trades, "
                    f"win {result['winRate']:.1f}%, P&L {result['pnl']:+,.2f} USD",
                )
                return self._json({"ok": True, "result": result})
            return self._json({"error": "não encontrado"}, 404)
        except RuntimeError as exc:
            return self._json({"error": str(exc)}, 400)
        except Exception as exc:  # noqa: BLE001
            return self._json({"error": f"erro interno: {exc}"}, 500)

    def _serve_file(self, name: str) -> None:
        fpath = os.path.join(WEB_DIR, name)
        if not os.path.isfile(fpath):
            return self._json({"error": "não encontrado"}, 404)
        with open(fpath, "rb") as fh:
            data = fh.read()
        ctype = mimetypes.guess_type(fpath)[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main() -> None:
    engine.start()
    server = ThreadingHTTPServer((config.HOST, config.PORT), Handler)
    print(f"APEXQUANT-OS V2 rodando em http://{config.HOST}:{config.PORT}")
    print(f"Símbolos: {', '.join(config.SYMBOLS)} | equity US$ {config.EQUITY_START:,.0f} "
          f"| risco US$ {config.RISK_PER_TRADE:,.2f}/trade | máx {config.MAX_POSITIONS} posições")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando...")
    finally:
        engine.stop()
        server.server_close()


if __name__ == "__main__":
    main()
