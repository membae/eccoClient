import { useState, useEffect } from "react";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("login");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------------- Fetch Countries ---------------- */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd,flag"
        );
        const data = await res.json();
        const formatted = data
          .map((c) => {
            if (!c.idd?.root || !c.idd?.suffixes) return null;
            return {
              name: c.name.common,
              code: c.idd.root + c.idd.suffixes[0],
              flag: c.flag,
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
          { name: "Kenya", code: "+254", flag: "🇰🇪" },
          { name: "United States", code: "+1", flag: "🇺🇸" },
          { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
        ];
        setCountries(fallback);
        setSelectedCountry(fallback[0]);
      }
    };
    fetchCountries();
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  /* ---------------- Submit to Backend ---------------- */
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

      setSuccess("Login successful!");
      console.log("Login response:", data);
      // TODO: Save token or redirect user
    } catch (err) {
      console.error(err);
      setError("Network error. Try again later.");
    }
  };

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
      console.log("Signup response:", data);
      setSignupForm({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
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
            className={`flex-1 py-2 text-white font-medium ${
              activeTab === "login" ? "bg-green-500" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-white font-medium ${
              activeTab === "signup" ? "bg-green-500" : "bg-gray-800"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-gray-200 text-sm font-medium mb-1 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                value={loginForm.email}
                onChange={handleLoginChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-200 text-sm font-medium mb-1 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={handleLoginChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold mt-2 transition"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="text-gray-200 text-sm font-medium mb-1 block">
                Full Name
              </label>
              <input
                name="fullName"
                value={signupForm.fullName}
                onChange={handleSignupChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-200 text-sm font-medium mb-1 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={signupForm.email}
                onChange={handleSignupChange}
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-200 text-sm font-medium mb-1 block">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCountry?.code || ""}
                  onChange={(e) =>
                    setSelectedCountry(
                      countries.find((c) => c.code === e.target.value)
                    )
                  }
                  className="w-32 px-3 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} {c.name}
                    </option>
                  ))}
                </select>

                <input
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleSignupChange}
                  placeholder="712345678"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {selectedCountry && (
                <p className="text-gray-200 text-sm mt-1">
                  {selectedCountry.flag} {selectedCountry.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-gray-200 text-sm font-medium mb-1 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={signupForm.password}
                onChange={handleSignupChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="text-gray-200 text-sm font-medium mb-1 block">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={signupForm.confirmPassword}
                onChange={handleSignupChange}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border ${
                  error ? "border-red-500" : "border-gray-700"
                } focus:ring-2 focus:ring-green-500 outline-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold mt-2 transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
