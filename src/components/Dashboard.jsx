import { useEffect, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";

const WATCHLIST = ["bitcoin", "ethereum", "usd-coin"];
const YOUR_CRYPTO = ["bitcoin", "ethereum", "binancecoin", "solana"];

const HOLDINGS = {
  bitcoin: 0.01,
  ethereum: 0.25,
  binancecoin: 1.5,
  solana: 2.5,
};

function Dashboard() {
  const [watchlist, setWatchlist] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchPrices = async (coins, setter) => {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(
        ","
      )}&sparkline=false`
    );
    const data = await res.json();
    setter(data);
    return data;
  };

  const refreshAll = async () => {
    const watch = await fetchPrices(WATCHLIST, setWatchlist);
    const portfolioData = await fetchPrices(YOUR_CRYPTO, setPortfolio);

    const total = portfolioData.reduce((sum, coin) => {
      return sum + (HOLDINGS[coin.id] || 0) * coin.current_price;
    }, 0);

    setBalance(total);
    setLastUpdated(new Date().toLocaleString());
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <div className="p-6 text-gray-200 flex flex-col gap-4">

      {/* 🔝 TOP SECTION */}
      <div className="h-[30vh] bg-gray-900 rounded-xl p-6 flex flex-col justify-between">
        <h1 className="text-xl font-bold">Real Portfolio</h1>

        <div>
          <p className="text-gray-400 text-sm">Balance (USD)</p>
          <p className="text-3xl font-bold mt-1">
            ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>

          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400">
              Deposit
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* 🔽 BOTTOM SECTION */}
      <div className="flex gap-4">

        {/* 📌 WATCH LIST (1/3) */}
        <div className="w-1/3 bg-gray-900 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Watch List</h2>

          {watchlist.map((coin) => (
            <div
              key={coin.id}
              className="py-3 border-b border-gray-800"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{coin.symbol.toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{coin.name}</p>
                </div>

                <p>${coin.current_price.toLocaleString()}</p>
              </div>

              <p
                className={`text-sm mt-1 ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>

        {/* 💼 YOUR CRYPTO (2/3) */}
        <div className="w-2/3 bg-gray-900 rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Your Crypto</h2>

          <div className="grid grid-cols-2 gap-4 flex-1">
            {portfolio.map((coin) => {
              const amount = HOLDINGS[coin.id];
              const value = amount * coin.current_price;

              return (
                <div
                  key={coin.id}
                  className="bg-gray-800 rounded-lg p-4 transition transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold">{coin.symbol.toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{coin.name}</p>
                    </div>
                    <p>${coin.current_price.toLocaleString()}</p>
                  </div>

                  <p className="text-sm text-gray-400">
                    Amount: {amount}
                  </p>
                  <p className="font-semibold">
                    Value: ${value.toLocaleString()}
                  </p>

                  <button className="mt-3 w-full flex items-center justify-center gap-2 bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-400">
                    <FaExchangeAlt />
                    Trade
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 mt-3 text-right">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
