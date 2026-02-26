import React, { useEffect, useState } from "react";
import DashboardNavbar from "./Navbar";
const API_URL = import.meta.env.VITE_API_URL;

function Withdraw() {
  const [method, setMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [user, setUser] = useState(null);

  // Fetch user balance from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    if (storedUser.balance && typeof storedUser.balance.balance === "number") {
      setAvailableBalance(storedUser.balance.balance);
    }
  }, []);

  // Wallet addresses
  const cryptoAddresses = {
    bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    usdt: "TQp9XK6GZ8kUSDTExampleAddress123",
    ethereum: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  };

  const handleAmountChange = (value) => {
    setAmount(value);

    if (availableBalance < 50) {
      setError("Minimum balance of $50 required to withdraw.");
    } else if (value <= 0) {
      setError("Enter a valid withdrawal amount.");
    } else if (value > availableBalance) {
      setError("Insufficient balance for this withdrawal.");
    } else {
      setError("");
    }
  };

  const isDisabled =
    !!error || amount > availableBalance || availableBalance < 50 || processing;

  const handleWithdraw = async () => {
    if (isDisabled) return;

    setProcessing(true);
    setError("");
    setSuccess(false);

    try {
      // Send negative amount to backend for withdrawal
      const res = await fetch(
        `${API_URL}/users/${user.id}/balance`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: (-amount).toString() }),
        }
      );

      if (!res.ok) throw new Error("Withdrawal failed.");

      // Update balance locally
      const newBalance = availableBalance - amount;
      setAvailableBalance(newBalance);
      const updatedUser = { ...user, balance: { ...user.balance, balance: newBalance } };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess(true);
      setAmount(0);
    } catch (err) {
      console.error(err);
      setError("Withdrawal failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-blue-900 p-6 rounded-xl shadow-lg text-white min-h-screen">
      <DashboardNavbar />

      {/* Header */}
      <h2 className="text-xl font-semibold">Withdraw Funds</h2>
      <p className="text-sm text-blue-200 mt-1">
        Choose your preferred withdrawal method below
      </p>

      {/* Balance */}
      <div className="mt-5 bg-blue-800 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold">${availableBalance.toFixed(2)}</p>
        <p className="text-sm text-blue-200">Available Balance</p>
        {availableBalance < 50 && (
          <p className="text-red-400 text-sm mt-1">
            Balance below $50 — withdrawals not allowed
          </p>
        )}
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

      {/* Amount Input */}
      <div className="mt-6">
        <label className="text-sm text-blue-200">Amount (USD)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
          className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
          disabled={processing}
        />
        {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
        {success && <p className="text-sm text-green-400 mt-1">Withdrawal Successful!</p>}
      </div>

      {/* Method-specific fields */}
      {method === "crypto" && (
        <div className="mt-5 grid grid-cols-3 gap-3">
          {["bitcoin", "usdt", "ethereum"].map((crypto) => (
            <div
              key={crypto}
              onClick={() => setSelectedCrypto(crypto)}
              className={`cursor-pointer rounded-xl p-4 text-center border transition ${
                selectedCrypto === crypto
                  ? "border-blue-400 bg-blue-800"
                  : "border-blue-700 hover:border-blue-400"
              }`}
            >
              <div className="text-3xl mb-1">
                {crypto === "bitcoin" ? "₿" : crypto === "usdt" ? "₮" : "Ξ"}
              </div>
              <div className="text-sm font-medium">{crypto.toUpperCase()}</div>
            </div>
          ))}

          {/* Wallet Address */}
          <div className="col-span-3 mt-4">
            <label className="text-sm text-blue-200">Wallet Address</label>
            <input
              readOnly
              value={cryptoAddresses[selectedCrypto]}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-black text-white border border-gray-700 text-sm"
            />
          </div>
        </div>
      )}

      {method === "bank" && (
        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Bank Name"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            disabled={processing}
          />
          <input
            type="text"
            placeholder="Account Number"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            disabled={processing}
          />
          <input
            type="text"
            placeholder="Account Holder Name"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            disabled={processing}
          />
          <input
            type="text"
            placeholder="SWIFT Code (Optional)"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            disabled={processing}
          />
        </div>
      )}

      {method === "mpesa" && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="M-Pesa Phone Number"
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
            disabled={processing}
          />
        </div>
      )}

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={isDisabled}
        className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
          isDisabled
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            Processing...
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          </span>
        ) : (
          "Withdraw"
        )}
      </button>

      {/* Pending Section */}
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
