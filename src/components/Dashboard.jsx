import { useEffect, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./Navbar";

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

  const navigate = useNavigate();

  const fetchPrices = async (coins, setter) => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(
          ","
        )}&sparkline=false`
      );
      const data = await res.json();
      setter(data);
      return data;
    } catch (err) {
      console.error(err);
      setter([]);
      return [];
    }
  };

  const refreshAll = async () => {
    const watch = await fetchPrices(WATCHLIST, setWatchlist);
    const portfolioData = await fetchPrices(YOUR_CRYPTO, setPortfolio);

    const total = (portfolioData || []).reduce((sum, coin) => {
      return sum + (HOLDINGS[coin.id] || 0) * coin.current_price;
    }, 0);

    setBalance(total);
    setLastUpdated(new Date().toLocaleString());
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-4 flex flex-col gap-4">
      <DashboardNavbar />

      <h1 className="text-green-500 text-lg font-semibold">Dashboard</h1>

      {/* 🔝 TOP SECTION */}
      <div className="h-[30vh] bg-white rounded-xl p-4 flex flex-col justify-between">
        <h1 className="text-xl font-bold text-gray-900">Real Portfolio</h1>

        <div>
          <p className="text-gray-500 text-sm">Balance (USD)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={() => navigate("/deposit")}
              className="px-4 py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400"
            >
              Deposit
            </button>

            <button 
              onClick={() => navigate("/withdraw")}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* 🔽 BOTTOM SECTION */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 📌 WATCH LIST */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Watch List
          </h2>

          {watchlist.map((coin) => (
            <div
              key={coin.id}
              className="py-3 border-b border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">
                    {coin.symbol.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">{coin.name}</p>
                </div>
                <p className="text-gray-900">
                  ${coin.current_price.toLocaleString()}
                </p>
              </div>

              <p
                className={`text-sm mt-1 ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          ))}

          <button
            onClick={() => fetchPrices(WATCHLIST, setWatchlist)}
            className="mt-4 py-2 w-full bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Refresh Prices
          </button>
        </div>

        {/* 💼 YOUR CRYPTO */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Your Crypto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portfolio.map((coin) => {
              const amount = HOLDINGS[coin.id];
              const value = amount * coin.current_price;

              return (
                <div
                  key={coin.id}
                  className="bg-slate-100 rounded-lg p-4 transition transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {coin.symbol.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">{coin.name}</p>
                    </div>
                    <p className="text-gray-900">
                      ${coin.current_price.toLocaleString()}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600">
                    Amount: {amount}
                  </p>
                  <p className="font-semibold text-gray-900">
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

          <p className="text-xs text-gray-500 mt-3 text-right">
            Last updated: {lastUpdated}
          </p>

          <button
            onClick={() => fetchPrices(YOUR_CRYPTO, setPortfolio)}
            className="mt-4 py-2 w-full bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Refresh Prices
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
