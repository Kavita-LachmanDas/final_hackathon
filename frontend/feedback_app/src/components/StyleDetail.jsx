import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import AddReviewForm from "../shared/AddReviewForm";

export default function StyleDetail() {
  const { id } = useParams();
  const [style, setStyle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStyle = async () => {
    try {
      const res = await API.get(`/hijabstyles/${id}`);
      setStyle(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStyle(); }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!style) return <div>Not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <img src={style.image} alt={style.name} className="w-full h-80 object-cover rounded" />
      <h2 className="text-2xl font-bold mt-4">{style.name}</h2>
      <p className="mt-2">{style.description}</p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Reviews — ⭐ {Number(style.averageRating || 0).toFixed(1)}</h3>
        <div className="mt-3 space-y-3">
          {style.reviews && style.reviews.length ? (
            style.reviews.map((r) => (
              <div key={r._id || Math.random()} className="p-3 bg-white rounded shadow">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.userName || "User"}</div>
                  <div>⭐ {r.rating}</div>
                </div>
                <p className="mt-1 text-sm">{r.text}</p>
              </div>
            ))
          ) : <p className="text-sm">No reviews yet.</p>}
        </div>
      </div>

      <div className="mt-6">
        <AddReviewForm styleId={id} onAdded={fetchStyle} />
      </div>
    </div>
  );
}
