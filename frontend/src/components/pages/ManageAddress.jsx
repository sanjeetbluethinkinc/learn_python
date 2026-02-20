import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function ManageAddress() {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axiosInstance.get("/api/address/");
        setAddresses(res.data);
      } catch (err) {
  console.error(err);

  if (err.response?.status === 401) {
    navigate("/login"); // only if unauthorized
  }
}
    };

    fetchAddresses();
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Address</h1>

      {addresses.length === 0 && (
        <p className="text-gray-500">No saved addresses.</p>
      )}

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-xl p-4 bg-gray-50"
          >
            <p className="font-semibold">{addr.full_name}</p>
            <p>{addr.street}</p>
            <p>
              {addr.city}, {addr.state} - {addr.zip_code}
            </p>
            <p>📞 {addr.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageAddress;