import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardNavbar from "./Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function BotRunning() {

  const location = useLocation();
  const botName = location.state?.botName || "Unknown Bot";

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const user = storedUser
    ? {
        ...storedUser,
        balance: {
          balance: Number(storedUser?.balance?.balance ?? 0),
        },
      }
    : { id: null, balance: { balance: 0 } };

  const storedConfigs = JSON.parse(localStorage.getItem("botConfigs")) || {};
  const configuredAmount = Number(storedConfigs[botName]?.amount ?? 0);

  const [botAmount, setBotAmount] = useState(configuredAmount);
  const [trades, setTrades] = useState(0);
  const [winRate, setWinRate] = useState(70);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [profit, setProfit] = useState(0);

  const intervalRef = useRef(null);

  const totalPL = +profit.toFixed(2);
  const isProfit = totalPL >= 0;

  /* BOT START */

  useEffect(() => {
    startBot();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startBot = () => {

    if (intervalRef.current) return;

    setRunning(true);

    intervalRef.current = setInterval(() => {

      const isWin = Math.random() < 0.7;

      let pnl;

      if (isWin) {
        pnl = +(Math.random() * 0.8 + 0.2).toFixed(2);
      } else {
        pnl = -+(Math.random() * 0.25 + 0.05).toFixed(2);
      }

      setBotAmount((prev) => +(prev + pnl).toFixed(2));
      setTrades((t) => t + 1);
      setProfit((prev) => +(prev + pnl).toFixed(2));

      setWinRate((w) =>
        Math.min(90, Math.max(60, +(w + (isWin ? 0.2 : -0.5)).toFixed(1)))
      );

      const btcPrice = (44850 + Math.random() * 300).toFixed(1);
      const side = Math.random() > 0.5 ? "BUY" : "SELL";
      const size = (Math.random() * 0.005 + 0.001).toFixed(4);

      addLog({
        symbol: "BTCUSDT",
        side,
        price: btcPrice,
        size,
        pnl,
      });

    }, 3000);
  };

  const pauseBot = () => {

    clearInterval(intervalRef.current);
    intervalRef.current = null;

    setRunning(false);

    addSystemLog("Bot paused");
  };

  const stopBot = async () => {

    clearInterval(intervalRef.current);
    intervalRef.current = null;

    setRunning(false);
    setLoading(true);

    try {

      const res = await fetch(`${API_URL}/users/${user.id}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: +botAmount.toFixed(2),
        }),
      });

      if (!res.ok) throw new Error("Failed to update balance");

      const response = await res.json();

      const numericBalance = Number(
        response?.balance?.balance ??
          response?.balance ??
          botAmount ??
          0
      );

      const updatedUser = {
        ...user,
        balance: {
          balance: numericBalance,
        },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      const updatedConfigs = { ...storedConfigs };
      delete updatedConfigs[botName];

      localStorage.setItem("botConfigs", JSON.stringify(updatedConfigs));

      addSystemLog("Bot stopped");
      addSystemLog(`Wallet credited: $${numericBalance.toFixed(2)}`);

    } catch (err) {

      console.error(err);

      addSystemLog("Failed to update wallet balance");

    } finally {

      setLoading(false);

    }
  };

  const addLog = ({ symbol, side, price, size, pnl }) => {

    setLogs((prev) => [
      {
        type: "trade",
        time: new Date().toLocaleTimeString(),
        symbol,
        side,
        price,
        size,
        pnl,
      },
      ...prev,
    ]);
  };

  const addSystemLog = (message) => {

    setLogs((prev) => [
      {
        type: "system",
        time: new Date().toLocaleTimeString(),
        message,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      <DashboardNavbar />

      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold">{botName} Bot</h1>
        <p className="text-xs text-gray-400">Bot ID: dca-1 • Account: Real</p>
      </div>

      <div
        className={`text-center py-2 font-semibold ${
          running ? "bg-green-500 text-black" : "bg-red-600"
        }`}
      >
        {running ? "Running" : "Stopped"}
      </div>

      <div className="flex gap-3 p-4">

        <button
          onClick={startBot}
          disabled={running || loading}
          className="flex-1 bg-gray-700 py-2 rounded disabled:opacity-50"
        >
          Start Bot
        </button>

        <button
          onClick={pauseBot}
          disabled={!running || loading}
          className="flex-1 bg-yellow-500 text-black py-2 rounded font-semibold"
        >
          Pause Bot
        </button>

        <button
          onClick={stopBot}
          disabled={loading}
          className="flex-1 bg-red-600 py-2 rounded font-semibold"
        >
          {loading ? "Stopping..." : "Stop Bot"}
        </button>

      </div>

      <div className="grid grid-cols-2 gap-4 px-4">

        <StatCard label="Bot Balance" value={`$${botAmount}`} accent="green" />

        <StatCard
          label="Total P/L"
          value={`${isProfit ? "+" : "-"}$${Math.abs(totalPL)}`}
          accent={isProfit ? "green" : "red"}
        />

        <StatCard label="Total Trades" value={trades} accent="purple" />

        <StatCard label="Win Rate" value={`${winRate}%`} accent="yellow" />

      </div>

      {/* LOGS */}

      <div className="px-4 mt-4 mb-20">

        <h3 className="text-sm text-gray-400 mb-2">
          Trading Activity ({logs.length})
        </h3>

        <div className="bg-black rounded-lg p-3 text-xs font-mono">

          {logs.map((log, i) => {

            if (log.type === "system") {

              return (
                <p key={i} className="text-gray-400 py-1">
                  [{log.time}] {log.message}
                </p>
              );
            }

            return (
              <div
                key={i}
                className="grid grid-cols-5 gap-2 py-1 border-b border-gray-800"
              >

                <span className="text-gray-500">[{log.time}]</span>

                <span className="text-yellow-400">{log.symbol}</span>

                <span
                  className={
                    log.side === "BUY"
                      ? "text-green-400 font-semibold"
                      : "text-red-400 font-semibold"
                  }
                >
                  {log.side}
                </span>

                <span className="text-gray-300">
                  {log.size} @ {log.price}
                </span>

                <span
                  className={
                    log.pnl >= 0
                      ? "text-green-400 font-semibold"
                      : "text-red-400 font-semibold"
                  }
                >
                  {log.pnl >= 0 ? "+" : "-"}${Math.abs(log.pnl)}
                </span>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

function StatCard({ label, value, accent }) {

  const accents = {
    green: "border-green-500",
    purple: "border-purple-500",
    yellow: "border-yellow-500",
    red: "border-red-500",
  };

  return (
    <div className={`bg-gray-900 border-l-4 ${accents[accent]} rounded p-3`}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}