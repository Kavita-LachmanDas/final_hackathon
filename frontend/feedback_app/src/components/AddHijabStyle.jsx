import React, { useState } from "react";
import { getToken } from "../utils/auth";
import API from "../api";

export default function AddHijabStyle() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("📦 Selected File:", image); // Debug

    if (!name || !description || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    console.log("📤 FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/hijabstyles", formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log("✅ API Response:", res.data);
      alert("✅ Hijab style added successfully!");
      setName("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("❌ Error response:", err.response || err);
      alert(err?.response?.data?.message || "❌ Error adding style");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Hijab Style</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter hijab style name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter description"
            rows="3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Add Style"}
        </button>
      </form>
    </div>
  );
}
