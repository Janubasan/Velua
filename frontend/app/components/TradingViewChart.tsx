"use client";
import { useEffect, useRef, useState } from "react";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function TradingViewChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [market, setMarket] = useState<any>(null);
  const [symbol, setSymbol] = useState("BTC/USDT");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const cleanSymbol = symbol.replace("/", "");
        const res = await fetch(`${apiUrl}/market/${cleanSymbol}`);
        const data = await res.json();
        setMarket(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 5000);

    // WebSocket
    let ws: WebSocket | null = null;
    try {
      const wsUrl = apiUrl.replace("http", "ws");
      ws = new WebSocket(`${wsUrl}/ws/market`);
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "market_update") {
          setMarket(msg.data);
        }
      };
    } catch {}

    return () => {
      clearInterval(interval);
      if (ws) ws.close();
    };
  }, [symbol]);

  useEffect(() => {
    if (!chartContainerRef.current || !market?.ohlcv) return;

    // Carrega lightweight-charts dinamicamente para evitar SSR issues
    let chart: any = null;
    let candleSeries: any = null;

    const initChart = async () => {
      const { createChart, ColorType } = await import("lightweight-charts");
      
      if (!chartContainerRef.current) return;
      
      chartContainerRef.current.innerHTML = "";
      
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "#15151f" },
          textColor: "#9ca3af",
        },
        grid: {
          vertLines: { color: "#23233a" },
          horzLines: { color: "#23233a" },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      candleSeries = chart.addCandlestickSeries({
        upColor: "#00ff88",
        downColor: "#ff3b5c",
        borderVisible: false,
        wickUpColor: "#00ff88",
        wickDownColor: "#ff3b5c",
      });

      const ohlcv = market.ohlcv || [];
      const data = ohlcv.map((c: number[]) => ({
        time: Math.floor(c[0] / 1000) as any,
        open: c[1],
        high: c[2],
        low: c[3],
        close: c[4],
      }));

      candleSeries.setData(data);

      // EMA lines
      const emaFastSeries = chart.addLineSeries({ color: "#8b5cf6", lineWidth: 1 });
      const emaSlowSeries = chart.addLineSeries({ color: "#ffcc00", lineWidth: 1 });

      // Calcula EMA simples para visualização
      const closes = ohlcv.map((c: number[]) => c[4]);
      const ema = (period: number) => {
        let k = 2 / (period + 1);
        let emaVal = closes[0];
        return closes.map((price: number, i: number) => {
          if (i === 0) return { time: Math.floor(ohlcv[i][0]/1000) as any, value: price };
          emaVal = price * k + emaVal * (1 - k);
          return { time: Math.floor(ohlcv[i][0]/1000) as any, value: emaVal };
        });
      };

      if (closes.length > 20) {
        emaFastSeries.setData(ema(9));
        emaSlowSeries.setData(ema(21));
      }

      chart.timeScale().fitContent();

      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    };

    initChart();

    return () => {
      if (chart) {
        try { chart.remove(); } catch {}
      }
    };
  }, [market?.ohlcv]);

  const trendColor = market?.trend === "up" ? "text-[#00ff88]" : market?.trend === "down" ? "text-[#ff3b5c]" : "text-gray-400";
  const rsiColor = (market?.rsi || 50) < 35 ? "text-[#00ff88]" : (market?.rsi || 50) > 65 ? "text-[#ff3b5c]" : "text-gray-300";

  return (
    <div className="bg-[#15151f] border border-[#23233a] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#23233a]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff9900] rounded-full flex items-center justify-center text-black font-bold text-xs">₿</div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{symbol}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${market?.trend === "up" ? "border-green-500/30 bg-green-500/10 text-green-300" : market?.trend === "down" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-gray-500/30 bg-gray-500/10 text-gray-300"}`}>
                  {market?.trend?.toUpperCase() || "LOADING"}
                </span>
                <span className="text-xs bg-[#23233a] px-2 py-0.5 rounded-full">BINANCE REAL</span>
              </div>
              <div className="flex items-center gap-3 text-xs mt-1">
                <span className="text-white font-mono font-bold text-sm">${market?.price?.toLocaleString() || "..."}</span>
                <span className={trendColor}>EMA {market?.ema_fast?.toFixed(0)}/{market?.ema_slow?.toFixed(0)}</span>
                <span className={rsiColor}>RSI {market?.rsi?.toFixed(1)}</span>
                <span className="text-gray-500">ATR {market?.atr}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-[#0a0a0f] border border-[#23233a] rounded-full px-3 py-1.5 text-xs text-white"
          >
            <option>BTC/USDT</option>
            <option>ETH/USDT</option>
            <option>SOL/USDT</option>
            <option>BNB/USDT</option>
          </select>
          <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" title="Preço real via Binance" />
          <span className="text-[10px] text-gray-500">LIVE</span>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="w-full" />

      {/* Footer stats */}
      <div className="grid grid-cols-4 gap-4 p-3 bg-[#0a0a0f] border-t border-[#23233a] text-xs">
        <div>
          <div className="text-gray-500">Preço</div>
          <div className="text-white font-mono font-bold">${market?.price?.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-gray-500">RSI (14)</div>
          <div className={`font-bold ${rsiColor}`}>{market?.rsi?.toFixed(2)} {market?.rsi < 35 ? "OVERSOLD" : market?.rsi > 65 ? "OVERBOUGHT" : ""}</div>
        </div>
        <div>
          <div className="text-gray-500">EMA Distance</div>
          <div className={Math.abs(market?.ema_distance || 0) > 3 ? "text-yellow-400" : "text-gray-300"}>{market?.ema_distance?.toFixed(2)}%</div>
        </div>
        <div>
          <div className="text-gray-500">Volume 24h</div>
          <div className="text-white">{market?.volume ? `${(market.volume).toFixed(2)}` : "..."}</div>
        </div>
      </div>
    </div>
  );
}
