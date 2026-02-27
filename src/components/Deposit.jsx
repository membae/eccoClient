import React, { useState } from "react";
import DashboardNavbar from "./Navbar";
import { FaBitcoin, FaEthereum, FaCreditCard } from "react-icons/fa";
import { SiTether } from "react-icons/si";
import { MdCurrencyBitcoin } from "react-icons/md";

function Deposit() {
  const [amount, setAmount] = useState(49);
  const [method, setMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");

  const walletAddresses = {
    bitcoin: "THFucayUDaikpRTEfrYK2GdvduZ5GRXAZs",
    usdt: "THFucayUDaikpRTEfrYK2GdvduZ5GRXAZs", // ✅ Updated
    ethereum: "THFucayUDaikpRTEfrYK2GdvduZ5GRXAZs",
  };

  const cryptoOptions = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      icon: <FaBitcoin size={28} />,
      color: "#F7931A",
    },
    {
      id: "usdt",
      name: "USDT",
      icon: <SiTether size={28} />,
      color: "#26A17B",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      icon: <FaEthereum size={28} />,
      color: "#3C3C3D",
    },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddresses[selectedCrypto]);
    alert("Wallet address copied!");
  };

  return (
    <div className="max-w-md mx-auto bg-blue-900 p-6 rounded-xl shadow-lg text-white">
      <DashboardNavbar />

      <h2 className="text-xl font-semibold mt-4">Fund Your Account</h2>
      <p className="text-sm text-blue-200 mt-1">
        Choose your preferred deposit method below
      </p>

      {/* Method Tabs */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => setMethod("crypto")}
          className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            method === "crypto"
              ? "bg-blue-600"
              : "bg-blue-800 hover:bg-blue-700"
          }`}
        >
          <MdCurrencyBitcoin size={20} />
          Crypto
        </button>

        <button
          onClick={() => setMethod("card")}
          className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            method === "card"
              ? "bg-blue-600"
              : "bg-blue-800 hover:bg-blue-700"
          }`}
        >
          <FaCreditCard size={18} />
          Card
        </button>
      </div>

      {/* ================= CRYPTO ================= */}
      {method === "crypto" && (
        <>
          {/* Crypto Options */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {cryptoOptions.map((crypto) => (
              <div
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto.id)}
                className={`cursor-pointer rounded-xl p-4 text-center border transition ${
                  selectedCrypto === crypto.id
                    ? "border-blue-400 bg-blue-800"
                    : "border-blue-700 hover:border-blue-400"
                }`}
              >
                <div
                  className="flex justify-center mb-2"
                  style={{ color: crypto.color }}
                >
                  {crypto.icon}
                </div>
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

            <div className="flex flex-col gap-3 mt-2">
              <textarea
                readOnly
                value={walletAddresses[selectedCrypto]}
                rows={3}
                className="w-full px-3 py-3 rounded-lg bg-black text-white text-sm break-all resize-none"
              />

              <button
                onClick={copyAddress}
                className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
              >
                Copy Address
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

          <button className="w-full mt-4 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition flex items-center justify-center gap-2">
            <FaCreditCard />
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Deposit;