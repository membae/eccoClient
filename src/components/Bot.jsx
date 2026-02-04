import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./Navbar";

const initialBots = [
  {
    name: "Bitcoin Accumulation",
    frequency: "Weekly",
    type: "DCA",
    description: "Dollar-cost averaging into Bitcoin on a weekly basis",
    risk: "Low",
    status: "Not Configured",
  },
  {
    name: "ETH DCA Pro",
    frequency: "Daily",
    type: "DCA",
    description: "Dynamic DCA based on RSI and volume indicators",
    risk: "Medium",
    status: "Not Configured",
  },
];

export default function BotDashboard() {
  const navigate = useNavigate();
  const [bots, setBots] = useState(initialBots);

  useEffect(() => {
    // Load saved bot configs from localStorage
    const savedConfigs = JSON.parse(localStorage.getItem("botConfigs")) || {};

    // Update bot status based on saved configs
    const updatedBots = bots.map((bot) => ({
      ...bot,
      status: savedConfigs[bot.name] ? "Configured" : "Not Configured",
      amount: savedConfigs[bot.name]?.amount || null,
    }));

    setBots(updatedBots);
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Automated Trading Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2">Automated Trading</h2>
        <p className="text-sm mb-4">
          Create and manage algorithmic trading strategies
        </p>

        <div className="flex flex-wrap items-center gap-8 mb-4">
          <div>
            <p className="text-2xl font-bold">{bots.length}</p>
            <p className="text-sm">Total Bots</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {bots.filter((b) => b.status === "Configured").length}
            </p>
            <p className="text-sm">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">+4.8%</p>
            <p className="text-sm">Weekly Return</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/configure")}
          className="bg-white text-blue-600 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Create New Bot →
        </button>
      </div>

      {/* Dollar-Cost Averaging Bots */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-1">
          Dollar-Cost Averaging Bots
        </h3>
        <p className="text-gray-300 mb-4 text-sm">
          Regular purchases of assets regardless of price
        </p>

        <button
          onClick={() => navigate("/configure")}
          className="bg-green-400 text-gray-900 font-semibold px-4 py-2 rounded mb-4 hover:bg-green-500 transition"
        >
          Create DCA Bot
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          {bots.map((bot) => (
            <div
              key={bot.name}
              className="bg-gray-800 p-4 rounded-lg flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {bot.name}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {bot.frequency} • {bot.type}
                  </p>
                  <p className="text-gray-300 mt-2 text-sm">{bot.description}</p>

                  <div className="mt-2 text-gray-400 text-sm flex justify-between w-2/3">
                    <span>
                      <strong>Risk:</strong> {bot.risk}
                    </span>
                    <span>
                      <strong>Performance:</strong> --
                    </span>
                  </div>
                </div>

                <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                  {bot.status}
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() =>
                    navigate(`/configure/${encodeURIComponent(bot.name)}`)
                  }
                  className="bg-gray-700 text-gray-300 px-3 py-2 rounded hover:bg-gray-600 transition flex-1"
                >
                  Configure
                </button>

                <button
                  onClick={() => navigate("/dcabot")}
                  className={`px-3 py-2 rounded flex-1 font-semibold transition ${
                    bot.status === "Configured"
                      ? "bg-green-400 text-gray-900 hover:bg-green-500"
                      : "bg-gray-500 text-gray-200 cursor-not-allowed"
                  }`}
                  disabled={bot.status !== "Configured"}
                >
                  Start {bot.type} Bot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
