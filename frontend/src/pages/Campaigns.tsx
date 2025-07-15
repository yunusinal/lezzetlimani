import { useEffect, useState } from "react";
import { getCampaigns } from "../api/restaurants/restaurant";
import type { Campaign } from "../api/restaurants/restaurant";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getCampaigns()
      .then(setCampaigns)
      .catch(() => setError("Kampanyalar yüklenemedi."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mevcut Kampanyalar</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : campaigns.length === 0 ? (
        <div>Şu anda aktif kampanya yok.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-4 shadow bg-yellow-50"
            >
              <h2 className="text-lg font-semibold mb-1">{c.title}</h2>
              <p className="mb-2 text-gray-700">{c.description}</p>
              <div className="text-xs text-gray-500">
                {new Date(c.start_date).toLocaleDateString()} -{" "}
                {new Date(c.end_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
