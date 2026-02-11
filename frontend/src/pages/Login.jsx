import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${BASEURL}/api/auth/login/`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ SAVE TOKEN & USER (CRITICAL)
      login(res.data);

      // ✅ REDIRECT AFTER LOGIN
      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md bg-[#020617] border border-slate-800 rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-semibold text-center text-white mb-2">
          Welcome Back
        </h2>

        <p className="text-sm text-gray-400 text-center mb-6">
          Login to your FoodMarket account
        </p>

        {error && (
          <div className="bg-red-600/10 border border-red-600 text-red-400 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full bg-[#020617] border border-slate-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full bg-[#020617] border border-slate-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition-all duration-300 text-white
              flex items-center justify-center gap-2
              ${
                loading
                  ? "bg-blue-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
              }
            `}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
