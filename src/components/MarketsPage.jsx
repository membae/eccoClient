import React, { useState } from 'react';
import MarketChart from './MarketChart';
import DashboardNavbar from './Navbar';

const MarketsPage = () => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

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
      <DashboardNavbar />

      <h1 className="text-3xl font-bold mb-2">Market Charts</h1>
      <p className="text-gray-400 mb-6">Real-time cryptocurrency market data</p>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {coins.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.symbol})
            </option>
          ))}
        </select>

        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {currencies.map(c => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <MarketChart coinId={selectedCoin} currency={selectedCurrency} />
    </div>
  );
};

export default MarketsPage;
