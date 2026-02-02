import React, { useState } from 'react';
import MarketChart from './MarketChart';
import DashboardNavbar from './Navbar';

const MarketsPage = () => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  // Popular cryptocurrencies
  const coins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'ripple', name: 'Ripple', symbol: 'XRP' },
  ];

  const currencies = ['usd', 'eur', 'gbp', 'jpy'];

  return (
    <div className="p-6">
        <DashboardNavbar/>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Market Charts</h1>
        <p className="text-gray-400">Real-time cryptocurrency market data</p>
      </div>

      {/* Coin and currency selector */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Select Cryptocurrency</label>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            {coins.map(coin => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Currency</label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          >
            {currencies.map(curr => (
              <option key={curr} value={curr}>
                {curr.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* The chart component */}
      <MarketChart 
        coinId={selectedCoin}
        currency={selectedCurrency}
      />
    </div>
  );
};

export default MarketsPage;