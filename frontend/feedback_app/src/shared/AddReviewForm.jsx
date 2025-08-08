import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AddReviewForm({ styleId, onAdded }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      await API.post(`/hijabstyles/${styleId}/reviews`, { text, rating });
      setText("");
      setRating(5);
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error adding review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="font-medium mb-2">Add a review</h4>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="text-sm">Rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="ml-2 p-1 border rounded">
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
          </select>
        </div>
        <div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows="3" className="w-full border p-2 rounded" placeholder="Write your review..." />
        </div>
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
