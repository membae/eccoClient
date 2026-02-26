import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Configure() {
  const navigate = useNavigate();
  const { botName } = useParams(); // use bot name from URL
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // ✅ read from "user"
    if (!storedUser) {
      setError("No user logged in");
      return;
    }
    setUser(storedUser);

    // Load existing config for this bot if it exists
    const savedConfigs = JSON.parse(localStorage.getItem("botConfigs")) || {};
    if (savedConfigs[botName]) {
      setAmount(savedConfigs[botName].amount);
    }
  }, [botName]);

  const handleSave = async () => {
    if (!user) return;

    const investAmount = parseFloat(amount);
    const currentBalance = parseFloat(user.balance.balance);

    if (investAmount > currentBalance) {
      setError("Insufficient balance");
      return;
    }

    try {
      // 1️⃣ Update balance via PATCH
      const response = await fetch(
        `${API_URL}/users/${user.id}/balance`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: -investAmount }), // subtract from balance
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to update balance");
        return;
      }

      // 2️⃣ Update user in localStorage
      const updatedUser = {
        ...user,
        balance: { ...user.balance, balance: parseFloat(data.balance) },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 3️⃣ Save bot configuration individually
      const existingConfigs = JSON.parse(localStorage.getItem("botConfigs")) || {};
      existingConfigs[botName] = { amount: investAmount };
      localStorage.setItem("botConfigs", JSON.stringify(existingConfigs));

      // 4️⃣ Redirect back to bots dashboard
      navigate("/bot");
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving configuration");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  if (!user) return null; // wait until user is loaded

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-green-400 font-semibold text-lg mb-4">
          Configure {botName}
        </h2>

        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Select Asset</label>
          <select className="w-full bg-gray-700 text-white px-3 py-2 rounded">
            <option>Bitcoin (BTC)</option>
            <option>Ethereum (ETH)</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="text-gray-400 text-sm mb-1 block">
            Investment Amount per Trade (USD)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
          />
        </div>

        <p className="text-xs text-green-400 mb-2">
          Minimum: $39 • Maximum: $10,000
        </p>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/bot")}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex-1 bg-green-400 text-gray-900 py-2 rounded font-semibold hover:bg-green-500"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
