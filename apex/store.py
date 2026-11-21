"""Persistência em JSON (substitui a API de records do artefato original).

Guarda posições abertas/fechadas, histórico de backtests e configurações
(auto on/off). Escrita atômica via arquivo temporário + rename.
"""
from __future__ import annotations

import json
import os
import threading
import time


class Store:
    def __init__(self, path: str):
        self.path = path
        self._lock = threading.Lock()
        self._data = self._load()

    def _load(self) -> dict:
        try:
            with open(self.path, encoding="utf-8") as fh:
                return json.load(fh)
        except Exception:
            return {"positions": [], "backtests": [], "auto": True, "log": []}

    def _save(self) -> None:
        os.makedirs(os.path.dirname(self.path) or ".", exist_ok=True)
        tmp = self.path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as fh:
            json.dump(self._data, fh, ensure_ascii=False, indent=1)
        os.replace(tmp, self.path)

    # --- posições ---------------------------------------------------------
    def positions(self) -> list[dict]:
        with self._lock:
            return list(self._data.get("positions", []))

    def open_positions(self) -> list[dict]:
        return [p for p in self.positions() if p.get("status") == "open"]

    def add_position(self, pos: dict) -> dict:
        with self._lock:
            self._data.setdefault("positions", []).insert(0, pos)
            self._save()
            return pos

    def update_position(self, pos: dict) -> None:
        with self._lock:
            items = self._data.get("positions", [])
            for i, p in enumerate(items):
                if p.get("id") == pos.get("id"):
                    items[i] = pos
                    break
            self._save()

    # --- backtests --------------------------------------------------------
    def backtests(self) -> list[dict]:
        with self._lock:
            return list(self._data.get("backtests", []))

    def add_backtest(self, result: dict) -> dict:
        with self._lock:
            self._data.setdefault("backtests", []).insert(0, result)
            self._data["backtests"] = self._data["backtests"][:20]
            self._save()
            return result

    # --- auto on/off ------------------------------------------------------
    def get_auto(self) -> bool:
        with self._lock:
            return bool(self._data.get("auto", True))

    def set_auto(self, on: bool) -> None:
        with self._lock:
            self._data["auto"] = on
            self._save()

    # --- log de operações -------------------------------------------------
    def log(self, kind: str, message: str) -> None:
        with self._lock:
            entry = {
                "ts": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "kind": kind,
                "message": message,
            }
            items = self._data.setdefault("log", [])
            items.insert(0, entry)
            self._data["log"] = items[:200]
            self._save()

    def get_log(self, limit: int = 60) -> list[dict]:
        with self._lock:
            return list(self._data.get("log", []))[:limit]
