import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaWallet,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );
    if (confirmLogout) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/logout");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        <p>No user data found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-200 mb-4 hover:text-green-400 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
          <FaUser />
          My Profile
        </h2>

        <div className="space-y-4">
          <ProfileRow
            icon={<FaUser />}
            label="Full Name"
            value={user.full_name}
          />

          <ProfileRow
            icon={<FaEnvelope />}
            label="Email"
            value={user.email}
          />

          <ProfileRow
            icon={<FaPhone />}
            label="Phone Number"
            value={user.phone_number}
          />

          <ProfileRow
            icon={<FaGlobe />}
            label="Country"
            value={user.country}
          />

          <ProfileRow
            icon={<FaWallet />}
            label="Account Balance"
            value={`$${user.balance?.balance?.toFixed(2) || "0.00"}`}
            highlight
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value, highlight }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 pb-2">
      <div className="flex items-center gap-3 text-gray-400">
        <span className="text-green-400">{icon}</span>
        <span>{label}</span>
      </div>
      <span
        className={`font-medium ${
          highlight ? "text-green-400 text-lg" : "text-gray-100"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default Profile;
