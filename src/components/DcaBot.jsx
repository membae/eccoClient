import {
  FaHome,
  FaChartLine,
  FaBolt,
  FaRobot,
  FaUser,
} from "react-icons/fa";

export default function BotRunning() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold">Bitcoin Accumulation Bot</h1>
        <p className="text-xs text-gray-400">
          Bot ID: dca-1 • Account: Real
        </p>
      </div>

      {/* STATUS */}
      <div className="bg-green-500 text-black text-center py-2 font-semibold">
        Running
      </div>

      {/* CONTROLS */}
      <div className="flex gap-3 p-4">
        <button
          disabled
          className="flex-1 bg-gray-700 text-gray-400 py-2 rounded opacity-60"
        >
          Start Bot
        </button>
        <button className="flex-1 bg-yellow-500 text-black py-2 rounded font-semibold">
          Pause Bot
        </button>
        <button className="flex-1 bg-red-600 py-2 rounded font-semibold">
          Stop Bot
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 px-4">
        <StatCard label="Total P/L" value="+$0.00" accent="green" />
        <StatCard label="Total Runs" value="1" accent="blue" />
        <StatCard label="Total Trades" value="0" accent="purple" />
        <StatCard label="Win Rate" value="0.0%" accent="yellow" />
        <StatCard label="Balance" value="$90.03" accent="cyan" />
      </div>

      {/* LOGS */}
      <div className="flex-1 px-4 mt-4 mb-20">
        <h3 className="text-sm text-gray-400 mb-2">
          Bot Logs <span className="text-xs">(7 entries)</span>
        </h3>

        <div className="bg-black rounded-lg p-3 space-y-2 text-xs text-green-400 max-h-60 overflow-y-auto">
          <p>[20:32:35] 🚀 High-Frequency Trading System loaded</p>
          <p>[20:32:35] 💰 Account Balance: $90.03</p>
          <p>[20:32:36] ⚙ BASIC Tier Active - Optimized for consistency</p>
          <p>[20:32:37] 📊 Base win rate: 70%</p>
          <p>[20:32:38] 🤖 Trading Bot activated</p>
          <p>[20:32:39] 📈 Strategy: High-frequency scalping</p>
          <p>[20:32:40] ✅ System ready</p>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
        <div className="flex justify-around py-2 text-gray-400 text-xs">
          <NavItem icon={<FaHome />} label="Home" />
          <NavItem icon={<FaChartLine />} label="Markets" />
          <NavItem icon={<FaBolt />} label="Trade" />
          <NavItem icon={<FaRobot />} label="Bots" active />
          <NavItem icon={<FaUser />} label="Profile" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ label, value, accent }) {
  const accents = {
    green: "border-green-500",
    blue: "border-blue-500",
    purple: "border-purple-500",
    yellow: "border-yellow-500",
    cyan: "border-cyan-500",
  };

  return (
    <div
      className={`bg-gray-900 border-l-4 ${accents[accent]} rounded p-3`}
    >
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex flex-col items-center ${
        active ? "text-green-400" : ""
      }`}
    >
      <div className="text-lg">{icon}</div>
      <span>{label}</span>
    </div>
  );
}
