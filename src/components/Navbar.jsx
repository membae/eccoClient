import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaBolt,
  FaRobot,
  FaSignOutAlt,
  FaBars,
  FaExchangeAlt,
} from "react-icons/fa";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: FaHome, path: "/dashboard" },
    { name: "Markets", icon: FaChartLine, path: "/market" },
    { name: "Spot Trading", icon: FaBolt, path: "/dashboard" },
    { name: "Futures", icon: FaExchangeAlt, path: "/dashboard" },
    { name: "Bots", icon: FaRobot, path: "/bots" },
    { name: "Logout", icon: FaSignOutAlt, path: "/logout" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-gray-900 text-gray-300 px-6 py-3 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-50">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-green-400 font-bold text-lg"
        >
          <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
            +
          </div>
          Eccoearn
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-green-500 text-black font-semibold"
                      : "hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars size={22} />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 right-4 bg-gray-800 text-white rounded-xl shadow-lg z-50 p-3 flex flex-col gap-2 w-52">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive(item.path)
                    ? "bg-green-500 text-black font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom Navbar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-gray-300 flex justify-around py-2 md:hidden shadow-lg">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 text-xs transition ${
                isActive(item.path)
                  ? "text-green-400"
                  : "hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}
