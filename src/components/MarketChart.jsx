import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import axios from 'axios';

const MarketChart = ({ coinId = 'bitcoin', currency = 'usd' }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('7');
  const [priceData, setPriceData] = useState({
    current: 0,
    change: 0,
    changePercentage: 0,
    high24h: 0,
    low24h: 0,
    marketCap: 0,
    volume24h: 0
  });

  // Time frame options in days for CoinGecko
  const timeFrames = [
    { label: '1D', value: '1' },
    { label: '7D', value: '7' },
    { label: '14D', value: '14' },
    { label: '30D', value: '30' },
    { label: '90D', value: '90' },
    { label: '1Y', value: '365' },
  ];

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  // Format large numbers
  const formatLargeNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  // Fetch chart data from CoinGecko
  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch market chart data
      const chartResponse = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: currency,
            days: selectedTimeFrame,
            interval: selectedTimeFrame === '1' ? 'hourly' : 'daily'
          }
        }
      );

      // Fetch coin details for current price and stats
      const detailsResponse = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          }
        }
      );

      const prices = chartResponse.data.prices;
      const marketData = detailsResponse.data.market_data;

      // Transform data for recharts
      const transformedData = prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        let label;
        
        if (selectedTimeFrame === '1') {
          // For 1 day, show hours
          label = date.getHours().toString().padStart(2, '0') + ':00';
        } else if (selectedTimeFrame === '7' || selectedTimeFrame === '14') {
          // For 7/14 days, show short date
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          // For longer periods, show month/day
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        return {
          timestamp,
          date: label,
          price,
          fullDate: date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      });

      setChartData(transformedData);

      // Set price data
      setPriceData({
        current: marketData.current_price[currency],
        change: marketData.price_change_24h_in_currency[currency],
        changePercentage: marketData.price_change_percentage_24h_in_currency[currency],
        high24h: marketData.high_24h[currency],
        low24h: marketData.low_24h[currency],
        marketCap: marketData.market_cap[currency],
        volume24h: marketData.total_volume[currency]
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError('Failed to fetch market data. Please try again.');
      
      // Fallback mock data for development
      if (process.env.NODE_ENV === 'development') {
        const mockData = Array.from({ length: 30 }, (_, i) => ({
          date: `Day ${i + 1}`,
          price: 25000 + Math.random() * 5000 - 2500,
          fullDate: `Mock data point ${i + 1}`
        }));
        setChartData(mockData);
        setPriceData({
          current: 25948,
          change: 120,
          changePercentage: 0.46,
          high24h: 26190,
          low24h: 25218,
          marketCap: 500000000000,
          volume24h: 92430000
        });
      }
    } finally {
      setLoading(false);
    }
  }, [coinId, currency, selectedTimeFrame]);

  useEffect(() => {
    fetchChartData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchChartData, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchChartData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-400">{payload[0].payload.fullDate}</p>
          <p className="text-green-400 font-bold">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error && chartData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-red-400 text-center">
          <p>{error}</p>
          <button
            onClick={fetchChartData}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header with price info */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {coinId.charAt(0).toUpperCase() + coinId.slice(1)} ({currency.toUpperCase()})
            </h2>
            <p className="text-gray-400">Live Market Data</p>
          </div>
          
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-3xl font-bold text-green-400">
              {formatPrice(priceData.current)}
            </div>
            <div className={`text-sm ${priceData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceData.change >= 0 ? '+' : ''}{formatPrice(priceData.change)} 
              ({priceData.changePercentage >= 0 ? '+' : ''}{priceData.changePercentage.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Time frame selector */}
        <div className="flex flex-wrap gap-2">
          {timeFrames.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedTimeFrame(value)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedTimeFrame === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#374151' }}
              tickFormatter={(value) => formatPrice(value).replace('$', '')}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorPrice)"
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">24h High</p>
          <p className="text-lg font-semibold">{formatPrice(priceData.high24h)}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">24h Low</p>
          <p className="text-lg font-semibold">{formatPrice(priceData.low24h)}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-lg font-semibold">{formatLargeNumber(priceData.marketCap)}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">24h Volume</p>
          <p className="text-lg font-semibold">{formatLargeNumber(priceData.volume24h)}</p>
        </div>
      </div>

      {/* Refresh button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={fetchChartData}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
          title="Refresh data"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default MarketChart;