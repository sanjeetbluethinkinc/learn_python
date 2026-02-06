import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// ✅ SAFE BASE URL (VERY IMPORTANT)
const BASEURL =
  import.meta.env.VITE_DJANGO_BASE_URL || "http://127.0.0.1:8000";


export default function ContactUs() {
  const [info, setInfo] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    message: "",
  });

  // ==========================
  // FETCH CONTACT DATA
  // ==========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const infoRes = await axios.get(
          `${BASEURL}/api/contact/info/`
        );
        const policyRes = await axios.get(
          `${BASEURL}/api/contact/policies/`
        );

        setInfo(infoRes.data || null);
        setPolicies(Array.isArray(policyRes.data) ? policyRes.data : []);
      } catch (error) {
        console.error("Contact API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================
  // SUBMIT FORM
  // ==========================
  const submitForm = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.message
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill all required fields.",
      });
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${BASEURL}/api/contact/submit/`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Message sent!",
        text: "We will contact you shortly.",
        confirmButtonColor: "#2563eb",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        gender: "male",
        message: "",
      });
    } catch (error) {
      console.error("Submit error:", error.response?.data || error);

      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text:
          error.response?.data?.detail ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-400">
        Loading...
      </p>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 py-16 px-4">
    <div className="max-w-6xl mx-auto space-y-16">

      {/* CONTACT INFO */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">
          Contact Us
        </h2>

        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {info?.email || "-"}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Phone:</span> {info?.phone || "-"}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Address:</span> {info?.address || "-"}
        </p>
      </div>

      {/* POLICIES */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">
          Company Policies
        </h3>

        {policies.length === 0 ? (
          <p className="text-gray-500">No policies available.</p>
        ) : (
          <div className="space-y-4">
            {policies.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 border border-gray-200 rounded-xl p-5"
              >
                <h4 className="text-gray-900 font-medium">
                  {p.title}
                </h4>
                <p className="text-gray-600">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTACT FORM */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm max-w-xl">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900">
          Get in Touch
        </h3>

        <div className="space-y-4">
          {["name", "email", "phone"].map((field) => (
            <input
              key={field}
              placeholder={field.toUpperCase()}
              value={form[field]}
              disabled={submitting}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <select
            value={form.gender}
            disabled={submitting}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value })
            }
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <textarea
            placeholder="Message"
            rows={4}
            value={form.message}
            disabled={submitting}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 resize-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />

          <button
            disabled={submitting}
            onClick={submitForm}
            className={`w-full py-3 rounded-xl font-medium text-white transition ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Message"}
          </button>
        </div>
      </div>

    </div>
  </div>
);

}
