import React, { useState } from "react";
import MarketChart from "./MarketChart";
import DashboardNavbar from "./Navbar";

const MarketsPage = () => {
  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");

  const coins = [
    { id: "BTCUSDT", name: "Bitcoin", symbol: "BTC" },
    { id: "ETHUSDT", name: "Ethereum", symbol: "ETH" },
    { id: "SOLUSDT", name: "Solana", symbol: "SOL" },
    { id: "ADAUSDT", name: "Cardano", symbol: "ADA" },
    { id: "XRPUSDT", name: "Ripple", symbol: "XRP" },
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      
      {/* Scrollable Content */}
      <div className="px-4 pt-6 pb-28">
        <h1 className="text-2xl font-bold mb-2">Market Charts</h1>
        <p className="text-gray-400 mb-6">
          Real-time cryptocurrency market data
        </p>

        {/* Coin Selector */}
        <div className="mb-6">
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="bg-gray-700 px-4 py-2 rounded w-full"
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
      <div className="fixed bottom-0 left-0 w-full h-20 bg-gray-900 border-t border-gray-700 z-50">
        <DashboardNavbar />
      </div>
    </div>
  );
};

export default MarketsPage;