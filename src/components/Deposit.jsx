import React, { useState } from "react";
import DashboardNavbar from "./Navbar";

function Deposit() {
  const [amount, setAmount] = useState(49);
  const [method, setMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");

  const walletAddresses = {
    bitcoin: "18ra7tQNP5hBo8JJ3LPbPr36o4zgNc1i5h",
    usdt: "TQp9XK6GZ8kUSDTexampleAddress123",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddresses[selectedCrypto]);
    alert("Wallet address copied!");
  };

  return (
    <div className="max-w-md mx-auto bg-blue-900 p-6 rounded-xl shadow-lg text-white">
        <DashboardNavbar/>
      {/* Header */}
      <h2 className="text-xl font-semibold">Fund Your Account</h2>
      <p className="text-sm text-blue-200 mt-1">
        Choose your preferred deposit method below
      </p>

      {/* Method Tabs */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => setMethod("crypto")}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            method === "crypto"
              ? "bg-blue-600"
              : "bg-blue-800 hover:bg-blue-700"
          }`}
        >
          💰 Crypto
        </button>
        <button
          onClick={() => setMethod("card")}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            method === "card"
              ? "bg-blue-600"
              : "bg-blue-800 hover:bg-blue-700"
          }`}
        >
          💳 Card
        </button>
      </div>

      {/* ================= CRYPTO ================= */}
      {method === "crypto" && (
        <>
          {/* Crypto Options */}
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
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Wallet Box */}
          <div className="mt-6 bg-blue-800 p-4 rounded-xl">
            <label className="text-sm text-blue-200">
              {selectedCrypto.charAt(0).toUpperCase() +
                selectedCrypto.slice(1)}{" "}
              Wallet Address
            </label>

            <div className="flex gap-2 mt-2">
              <input
                readOnly
                value={walletAddresses[selectedCrypto]}
                className="flex-1 px-3 py-2 rounded-lg bg-black text-white text-sm"
              />
              <button
                onClick={copyAddress}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
              >
                Copy
              </button>
            </div>

            <p className="text-xs text-blue-200 mt-3">
              Send the exact amount to this address and your account will be
              credited automatically.
            </p>
          </div>
        </>
      )}

      {/* ================= CARD ================= */}
      {method === "card" && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-blue-200">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <div>
            <label className="text-sm text-blue-200">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm text-blue-200">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-blue-200">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-blue-200">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            />
          </div>

          <button className="w-full mt-4 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition">
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Deposit;
