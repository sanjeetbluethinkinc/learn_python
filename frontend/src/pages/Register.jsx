import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${BASEURL}/api/auth/register/`,
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md bg-[#020617] border border-slate-800 rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-semibold text-center text-white mb-2">
          Create Account
        </h2>

        <p className="text-sm text-gray-400 text-center mb-6">
          Join FoodMarket today
        </p>

        {error && (
          <div className="bg-red-600/10 border border-red-600 text-red-400 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-slate-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          />

          <input
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-slate-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-slate-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
