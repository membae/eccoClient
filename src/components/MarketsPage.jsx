import React, { useState } from 'react';
import MarketChart from './MarketChart';
import DashboardNavbar from './Navbar';

const MarketsPage = () => {
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');

  const coins = [
    { id: 'BTCUSDT', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ETHUSDT', name: 'Ethereum', symbol: 'ETH' },
    { id: 'SOLUSDT', name: 'Solana', symbol: 'SOL' },
    { id: 'ADAUSDT', name: 'Cardano', symbol: 'ADA' },
    { id: 'XRPUSDT', name: 'Ripple', symbol: 'XRP' },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-2">Market Charts</h1>
        <p className="text-gray-400 mb-6">Real-time cryptocurrency market data</p>

        {/* Coin Selector */}
        <div className="mb-6">
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded"
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <MarketChart coinSymbol={selectedCoin} />
      </div>

      {/* Fixed Bottom Navbar */}
      <DashboardNavbar className="fixed bottom-0 left-0 w-full z-50" />
    </div>
  );
};

export default MarketsPage;