import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/auth");
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Hijab Gallery</Link>
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm">Hi, {userName || "User"}</span>
              <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/auth" className="px-3 py-1 bg-blue-600 text-white rounded">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
