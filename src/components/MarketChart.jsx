import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { createChart, CandlestickSeries } from "lightweight-charts";

const MarketChart = ({ coinSymbol = "BTCUSDT" }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [priceData, setPriceData] = useState({ current: 0, change: 0 });

  const intervals = [
    { label: "1m", value: "1m" },
    { label: "3m", value: "3m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "30m", value: "30m" },
    { label: "1h", value: "1h" },
    { label: "1D", value: "1d" },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 350,
      layout: {
        background: { color: "#1F2937" },
        textColor: "#D1D5DB",
      },
      grid: {
        vertLines: { color: "#374151" },
        horzLines: { color: "#374151" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10B981",
      downColor: "#EF4444",
      wickUpColor: "#10B981",
      wickDownColor: "#EF4444",
      borderVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://api.binance.com/api/v3/klines",
          {
            params: {
              symbol: coinSymbol,
              interval: selectedInterval,
              limit: 200,
            },
          }
        );

        const candles = res.data.map((d) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));

        candleSeries.setData(candles);

        const first = candles[0];
        const last = candles[candles.length - 1];

        setPriceData({
          current: last.close,
          change: ((last.close - first.close) / first.close) * 100,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [coinSymbol, selectedInterval]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full">
      {/* Price Section */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-green-400">
          {formatPrice(priceData.current)}
        </div>
        <div
          className={`text-sm ${
            priceData.change >= 0
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {priceData.change.toFixed(2)}%
        </div>
      </div>

      {/* Time Durations */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {intervals.map((intv) => (
          <button
            key={intv.value}
            onClick={() => setSelectedInterval(intv.value)}
            className={`px-3 py-1 text-sm rounded transition ${
              selectedInterval === intv.value
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {intv.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div
        ref={chartContainerRef}
        className="w-full"
      />
    </div>
  );
};

export default MarketChart;