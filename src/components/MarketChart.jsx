import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  createChart,
  CandlestickSeries,
} from 'lightweight-charts';

const MarketChart = ({ coinId = 'bitcoin', currency = 'usd' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState('7');
  const [priceData, setPriceData] = useState({
    current: 0,
    change: 0,
    changePercentage: 0,
  });

  const timeFrames = [
    { label: '1D', value: '1' },
    { label: '7D', value: '7' },
    { label: '14D', value: '14' },
    { label: '30D', value: '30' },
    { label: '90D', value: '90' },
    { label: '1Y', value: '365' },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price);

  useEffect(() => {
    // 🧠 CREATE CHART
    const chart = createChart(chartContainerRef.current, {
      height: 350,
      layout: {
        background: { color: '#1F2937' },
        textColor: '#D1D5DB',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // ✅ V4+ CORRECT WAY
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
      borderVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;

    const fetchData = async () => {
      // 🕯 OHLC DATA
      const ohlcRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc`,
        {
          params: {
            vs_currency: currency,
            days: selectedTimeFrame,
          },
        }
      );

      candleSeries.setData(
        ohlcRes.data.map(([t, o, h, l, c]) => ({
          time: Math.floor(t / 1000),
          open: o,
          high: h,
          low: l,
          close: c,
        }))
      );

      // 💰 PRICE HEADER
      const detailsRes = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        { params: { market_data: true, localization: false } }
      );

      const m = detailsRes.data.market_data;
      setPriceData({
        current: m.current_price[currency],
        change: m.price_change_24h_in_currency[currency],
        changePercentage: m.price_change_percentage_24h,
      });
    };

    fetchData();

    const resize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      chart.remove();
    };
  }, [coinId, currency, selectedTimeFrame]);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold capitalize">{coinId}</h2>
          <p className="text-gray-400">Candlestick Chart</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">
            {formatPrice(priceData.current)}
          </div>
          <p className={priceData.change >= 0 ? 'text-green-400' : 'text-red-400'}>
            {priceData.change.toFixed(2)} ({priceData.changePercentage.toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* TIMEFRAMES */}
      <div className="flex gap-2 mb-4">
        {timeFrames.map(tf => (
          <button
            key={tf.value}
            onClick={() => setSelectedTimeFrame(tf.value)}
            className={`px-3 py-1 rounded ${
              selectedTimeFrame === tf.value
                ? 'bg-blue-600'
                : 'bg-gray-700'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div ref={chartContainerRef} className="w-full rounded-lg" />
    </div>
  );
};

export default MarketChart;
