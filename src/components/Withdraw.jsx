import React, { useState } from "react";
import DashboardNavbar from "./Navbar";

function Withdraw() {
  const [method, setMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState(100);
  const [error, setError] = useState("");

  // This should come from backend later
  const availableBalance = 0.0;

  // Different wallet address per crypto
  const cryptoAddresses = {
    bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    usdt: "TQp9XK6GZ8kUSDTExampleAddress123",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  };

  const handleAmountChange = (value) => {
    setAmount(value);

    if (value <= 0) {
      setError("Enter a valid withdrawal amount.");
    } else if (value > availableBalance) {
      setError("Insufficient balance for this withdrawal.");
    } else {
      setError("");
    }
  };

  const isDisabled = !!error || amount > availableBalance;

  return (
    <div className="max-w-md mx-auto bg-blue-900 p-6 rounded-xl shadow-lg text-white">
        <DashboardNavbar/>
      {/* Header */}
      <h2 className="text-xl font-semibold">Withdraw Funds</h2>
      <p className="text-sm text-blue-200 mt-1">
        Choose your preferred withdrawal method below
      </p>

      {/* Balance */}
      <div className="mt-5 bg-blue-800 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold">${availableBalance.toFixed(2)}</p>
        <p className="text-sm text-blue-200">Available Balance</p>
      </div>

      {/* Method Tabs */}
      <div className="flex gap-3 mt-5">
        {[
          { id: "crypto", label: "💰 Crypto" },
          { id: "bank", label: "🏦 Bank" },
          { id: "mpesa", label: "📱 M-Pesa" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              method === m.id
                ? "bg-blue-600"
                : "bg-blue-800 hover:bg-blue-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ================= CRYPTO ================= */}
      {method === "crypto" && (
        <>
          {/* Crypto Selector */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { id: "bitcoin", icon: "₿", name: "Bitcoin" },
              { id: "usdt", icon: "₮", name: "USDT" },
              { id: "ethereum", icon: "Ξ", name: "Ethereum" },
            ].map((crypto) => (
              <div
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto.id)}
                className={`cursor-pointer rounded-xl p-4 text-center border transition ${
                  selectedCrypto === crypto.id
                    ? "border-blue-400 bg-blue-800"
                    : "border-blue-700 hover:border-blue-400"
                }`}
              >
                <div className="text-3xl mb-1">{crypto.icon}</div>
                <div className="text-sm font-medium">{crypto.name}</div>
              </div>
            ))}
          </div>

          {/* Amount */}
          <div className="mt-6">
            <label className="text-sm text-blue-200">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          {/* Wallet Address */}
          <div className="mt-5">
            <label className="text-sm text-blue-200">Your Wallet Address</label>
            <input
              readOnly
              value={cryptoAddresses[selectedCrypto]}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-black text-white border border-gray-700 text-sm"
            />
          </div>

          <button
            disabled={isDisabled}
            className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
              isDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Withdraw
          </button>
        </>
      )}

      {/* ================= BANK ================= */}
      {method === "bank" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-blue-200">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-sm text-blue-200">Bank Name</label>
            <input
              type="text"
              placeholder="e.g. Chase Bank"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <div>
            <label className="text-sm text-blue-200">Account Number</label>
            <input
              type="text"
              placeholder="1234567890"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <div>
            <label className="text-sm text-blue-200">
              Account Holder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <div>
            <label className="text-sm text-blue-200">
              SWIFT Code (Optional)
            </label>
            <input
              type="text"
              placeholder="CHASUS33"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <button
            disabled={isDisabled}
            className={`w-full mt-4 py-3 rounded-lg font-semibold ${
              isDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Withdraw
          </button>
        </div>
      )}

      {/* ================= MPESA ================= */}
      {method === "mpesa" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-blue-200">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-sm text-blue-200">
              M-Pesa Phone Number
            </label>
            <input
              type="text"
              placeholder="2547XXXXXXXX"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <button
            disabled={isDisabled}
            className={`w-full py-3 rounded-lg font-semibold ${
              isDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Withdraw
          </button>
        </div>
      )}

      {/* ================= PENDING ================= */}
      <div className="mt-8 bg-blue-800 rounded-xl p-4 text-center">
        <p className="font-semibold mb-2">Pending Withdrawals</p>
        <div className="text-3xl mb-2">📭</div>
        <p className="text-sm text-blue-200">
          No pending withdrawals found. Submit a withdrawal request above.
        </p>
      </div>
    </div>
  );
}

export default Withdraw;
