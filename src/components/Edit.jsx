import React, { useEffect, useState } from "react";
import DashboardNavbar from "./Navbar";

function GetUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState({});

  // FETCH USERS
  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load users");
        setLoading(false);
      });
  }, []);

  // PATCH BALANCE ONLY
  const updateBalance = (id) => {
    const value = Number(amount[id]);
    if (!value) return alert("Enter a valid amount");

    fetch(`http://127.0.0.1:5000/users/${id}/balance`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: value }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? {
                  ...u,
                  balance: {
                    ...u.balance,
                    balance: data.balance,
                  },
                }
              : u
          )
        );
        setAmount({ ...amount, [id]: "" });
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <DashboardNavbar/>
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-gray-300 text-sm uppercase">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Country</th>
              <th className="p-3">Role</th>
              <th className="p-3">Balance</th>
              <th className="p-3">Balance Update</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="p-3 font-medium">{user.full_name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone_number}</td>
                <td className="p-3">{user.country}</td>

                {/* VIEW ONLY ROLE */}
                <td className="p-3 capitalize text-gray-300">
                  {user.role}
                </td>

                <td className="p-3 text-green-400">
                  {user.balance?.balance ?? 0}
                </td>

                {/* BALANCE PATCH */}
                <td className="p-3 flex gap-2">
                  <input
                    type="number"
                    placeholder="+ / - amount"
                    value={amount[user.id] || ""}
                    onChange={(e) =>
                      setAmount({
                        ...amount,
                        [user.id]: e.target.value,
                      })
                    }
                    className="w-24 bg-gray-700 p-1 rounded"
                  />
                  <button
                    onClick={() => updateBalance(user.id)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-400 mt-4">
        Total users: {users.length}
      </p>
    </div>
  );
}

export default GetUsers;
