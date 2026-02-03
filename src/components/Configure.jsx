// components/ConfigureBot.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function ConfigureBot() {
  const navigate = useNavigate();
  const { botName } = useParams();
  const [amount, setAmount] = useState("");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-green-400 font-semibold text-lg mb-4">
          Configure {decodeURIComponent(botName)} Bot
        </h2>

        {/* Asset */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">
            Select Asset
          </label>
          <select className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none">
            <option>Bitcoin (BTC)</option>
            <option>Ethereum (ETH)</option>
          </select>
        </div>

        {/* Amount */}
        <div className="mb-2">
          <label className="text-gray-400 text-sm mb-1 block">
            Investment Amount per Trade (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none"
          />
        </div>

        <p className="text-xs text-green-400 mb-6">
          Minimum: $39 • Maximum: $10,000
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/bot")}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              // save config logic here
              navigate("/bots");
            }}
            className="flex-1 bg-green-400 text-gray-900 py-2 rounded font-semibold hover:bg-green-500 transition"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
