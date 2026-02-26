import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart, CandlestickSeries } from 'lightweight-charts';

const MarketChart = ({ coinSymbol = 'BTCUSDT' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  const [selectedInterval, setSelectedInterval] = useState('1m');
  const [priceData, setPriceData] = useState({ current: 0, change: 0 });

  // Binance valid intervals
  const intervals = [
    { label: '1m', value: '1m' },
    { label: '3m', value: '3m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '30m', value: '30m' },
    { label: '1h', value: '1h' },
    { label: '1D', value: '1d' },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#1F2937' }, textColor: '#D1D5DB' },
      grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

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
      try {
        const res = await axios.get('https://api.binance.com/api/v3/klines', {
          params: { symbol: coinSymbol, interval: selectedInterval, limit: 500 },
        });

        const candles = res.data.map(([openTime, open, high, low, close]) => ({
          time: Math.floor(openTime / 1000),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
        }));

        candleSeries.setData(candles);

        const lastPrice = candles[candles.length - 1];
        const firstPrice = candles[0];
        setPriceData({
          current: lastPrice.close,
          change: ((lastPrice.close - firstPrice.close) / firstPrice.close) * 100,
        });
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };

    fetchData();

    const resize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: 400, // fixed height for scrollable container
      });
    };

    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
      chart.remove();
    };
  }, [coinSymbol, selectedInterval]);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{coinSymbol}</h2>
          <p className="text-gray-400">Candlestick Chart</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">{formatPrice(priceData.current)}</div>
          <p className={priceData.change >= 0 ? 'text-green-400' : 'text-red-400'}>
            {priceData.change.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Interval Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {intervals.map((intv) => (
          <button
            key={intv.value}
            onClick={() => setSelectedInterval(intv.value)}
            className={`px-3 py-1 rounded ${
              selectedInterval === intv.value ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            {intv.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div ref={chartContainerRef} className="w-full rounded-lg" />
    </div>
  );
};

export default MarketChart;