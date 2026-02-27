import React, { useEffect, useState } from "react";
import DashboardNavbar from "./Navbar";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiTether } from "react-icons/si";

const API_URL = import.meta.env.VITE_API_URL;

function Withdraw() {
  const [method, setMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    swift: "",
  });

  const [availableBalance, setAvailableBalance] = useState(0);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    if (storedUser.balance?.balance) {
      setAvailableBalance(storedUser.balance.balance);
    }
  }, []);

  const cryptoOptions = [
    { id: "bitcoin", name: "Bitcoin", icon: <FaBitcoin size={28} />, color: "#F7931A" },
    { id: "usdt", name: "USDT (TRC20)", icon: <SiTether size={28} />, color: "#26A17B" },
    { id: "ethereum", name: "Ethereum", icon: <FaEthereum size={28} />, color: "#3C3C3D" },
  ];

  /* ================= VALIDATION ================= */

  const validateAmount = () => {
    if (availableBalance < 50) return "Minimum balance of $50 required.";
    if (!amount || amount <= 0) return "Enter valid withdrawal amount.";
    if (amount > availableBalance) return "Insufficient balance.";
    return "";
  };

  const isDisabled = processing;

  /* ================= WITHDRAW ================= */

  const handleWithdraw = async () => {
    setError("");
    setSuccess(false);

    const amountError = validateAmount();
    if (amountError) return setError(amountError);

    if (method === "crypto" && !walletAddress) {
      return setError("Enter wallet address.");
    }

    if (method === "mpesa" && !mpesaNumber) {
      return setError("Enter M-Pesa phone number.");
    }

    if (method === "bank" && (!bankDetails.bankName || !bankDetails.accountNumber)) {
      return setError("Complete bank details.");
    }

    setProcessing(true);

    try {
      const res = await fetch(`${API_URL}/users/${user.id}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: (-amount).toString() }),
      });

      if (!res.ok) throw new Error();

      const newBalance = availableBalance - amount;
      setAvailableBalance(newBalance);

      const updatedUser = {
        ...user,
        balance: { ...user.balance, balance: newBalance },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess(true);
      setAmount(0);
      setWalletAddress("");
      setMpesaNumber("");
    } catch {
      setError("Withdrawal failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-blue-900 p-6 rounded-xl shadow-lg text-white min-h-screen pb-24 overflow-y-auto">
      <DashboardNavbar />

      <h2 className="text-xl font-semibold">Withdraw Funds</h2>

      {/* Balance */}
      <div className="mt-5 bg-blue-800 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold">${availableBalance.toFixed(2)}</p>
        <p className="text-sm text-blue-200">Available Balance</p>
      </div>

      {/* Method Tabs */}
      <div className="flex gap-3 mt-5">
        {["crypto", "bank", "mpesa"].map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-2 rounded-lg ${
              method === m ? "bg-blue-600" : "bg-blue-800"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= CRYPTO ================= */}
      {method === "crypto" && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {cryptoOptions.map((crypto) => (
              <div
                key={crypto.id}
                onClick={() => setSelectedCrypto(crypto.id)}
                className={`cursor-pointer rounded-xl p-4 text-center border ${
                  selectedCrypto === crypto.id
                    ? "border-blue-400 bg-blue-800"
                    : "border-blue-700"
                }`}
              >
                <div style={{ color: crypto.color }}>{crypto.icon}</div>
                <div className="text-sm">{crypto.name}</div>
              </div>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm text-blue-200">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
              disabled={processing}
            />
          </div>

          {/* Wallet */}
          <div>
            <label className="text-sm text-blue-200">Your Wallet Address</label>
            <textarea
              rows={3}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-black text-white text-sm break-all"
            />
          </div>
        </div>
      )}

      {/* ================= BANK ================= */}
      {method === "bank" && (
        <div className="mt-5 space-y-3">
          {/* Amount */}
          <div>
            <label className="text-sm text-blue-200">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
              disabled={processing}
            />
          </div>

          <input
            type="text"
            placeholder="Bank Name"
            onChange={(e) =>
              setBankDetails({ ...bankDetails, bankName: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
          />

          <input
            type="text"
            placeholder="Account Number"
            onChange={(e) =>
              setBankDetails({ ...bankDetails, accountNumber: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
          />

          <input
            type="text"
            placeholder="Account Holder Name"
            onChange={(e) =>
              setBankDetails({ ...bankDetails, accountName: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
          />
        </div>
      )}

      {/* ================= MPESA ================= */}
      {method === "mpesa" && (
        <div className="mt-5 space-y-3">
          {/* Amount */}
          <div>
            <label className="text-sm text-blue-200">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
              disabled={processing}
            />
          </div>

          <input
            type="text"
            placeholder="M-Pesa Phone Number (07XXXXXXXX)"
            value={mpesaNumber}
            onChange={(e) => setMpesaNumber(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-700"
          />
        </div>
      )}

      {/* ERROR / SUCCESS */}
      {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
      {success && (
        <p className="text-green-400 mt-3 text-sm">
          Withdrawal Successful!
        </p>
      )}

      {/* BUTTON */}
      <button
        onClick={handleWithdraw}
        disabled={isDisabled}
        className="w-full mt-6 py-3 bg-blue-600 rounded-lg"
      >
        {processing ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
}

export default Withdraw;