import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [activeTab, setActiveTab] = useState("login");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- FETCH COUNTRIES ---------------- */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,flags"
        );
        const data = await res.json();

        const formatted = data
          .map((c) => {
            if (!c.idd?.root || !c.idd?.suffixes) return null;
            return {
              name: c.name.common,
              code: c.idd.root + c.idd.suffixes[0],
              flag: c.flags.png,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formatted);
        setSelectedCountry(
          formatted.find((c) => c.name === "Kenya") || formatted[0]
        );
      } catch {
        const fallback = [
          {
            name: "Kenya",
            code: "+254",
            flag: "https://flagcdn.com/w20/ke.png",
          },
          {
            name: "United States",
            code: "+1",
            flag: "https://flagcdn.com/w20/us.png",
          },
          {
            name: "United Kingdom",
            code: "+44",
            flag: "https://flagcdn.com/w20/gb.png",
          },
        ];
        setCountries(fallback);
        setSelectedCountry(fallback[0]);
      }
    };

    fetchCountries();
  }, []);

  /* ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  /* ---------------- LOGIN ---------------- */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

      setSuccess("Login successful!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch {
      setError("Network error. Try again later.");
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      full_name: signupForm.fullName,
      email: signupForm.email,
      country: selectedCountry.name,
      phone_number: `${selectedCountry.code}${signupForm.phone}`,
      password: signupForm.password,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setSuccess("Signup successful! You can now log in.");
      setSignupForm({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setActiveTab("login");
    } catch {
      setError("Network error. Try again later.");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-blue-800 px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome to Fentibot
        </h1>
        <p className="text-gray-300 text-center mb-6">
          Your trusted platform for cryptocurrency trading
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden">
          <button
            className={`flex-1 py-2 text-white ${
              activeTab === "login" ? "bg-green-500" : ""
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-white ${
              activeTab === "signup" ? "bg-green-500" : ""
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        {/* LOGIN */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={handleLoginChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
            />
            <button className="w-full bg-green-500 py-3 rounded-lg text-white">
              Login
            </button>
          </form>
        )}

        {/* SIGNUP */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <input
              name="fullName"
              placeholder="Full Name"
              value={signupForm.fullName}
              onChange={handleSignupChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={signupForm.email}
              onChange={handleSignupChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
            />

            {/* COUNTRY PICKER */}
            <div className="flex gap-2 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-32 flex items-center gap-2 px-3 py-3 rounded-lg bg-gray-800 text-white"
              >
                {selectedCountry && (
                  <>
                    <img
                      src={selectedCountry.flag}
                      alt={selectedCountry.name}
                      className="w-5 h-4 rounded"
                    />
                    <span>{selectedCountry.code}</span>
                  </>
                )}
              </button>

              {openDropdown && (
                <div className="absolute top-14 left-0 w-64 max-h-60 overflow-y-auto bg-gray-900 rounded-lg shadow-lg z-20">
                  {countries.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c);
                        setOpenDropdown(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer text-white"
                    >
                      <img src={c.flag} className="w-5 h-4 rounded" />
                      <span className="flex-1 text-sm">{c.name}</span>
                      <span className="text-gray-400 text-sm">{c.code}</span>
                    </div>
                  ))}
                </div>
              )}

              <input
                name="phone"
                placeholder="Phone Number"
                value={signupForm.phone}
                onChange={handleSignupChange}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white"
              />
            </div>

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={handleSignupChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={signupForm.confirmPassword}
              onChange={handleSignupChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
            />

            <button className="w-full bg-green-500 py-3 rounded-lg text-white">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
