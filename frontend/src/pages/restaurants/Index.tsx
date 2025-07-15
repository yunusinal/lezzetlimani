import { useEffect, useState } from "react";
import { searchRestaurants } from "../../api/restaurants/restaurant";
import type {
  RestaurantFilters,
  RestaurantSearchResult,
} from "../../api/restaurants/restaurant";
import type { RestaurantResponseDTO } from "../../types/index";
import { addFavoriteRestaurant } from "../../api/user/user.api";

const cuisineOptions = ["pizza", "dürüm", "burger", "kebap", "tatlı"];
const sortOptions = [
  { value: "prep_time", label: "Hazırlama Süresi" },
  { value: "rating", label: "Puan" },
  { value: "delivery_fee", label: "Teslimat Ücreti" },
  { value: "name", label: "İsim" },
];

export default function RestaurantListPage() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [restaurants, setRestaurants] = useState<RestaurantResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      const result: RestaurantSearchResult = await searchRestaurants(filters);
      setRestaurants(result.restaurants);
    } catch (err: any) {
      setError("Restoranlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line
  }, [JSON.stringify(filters)]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restoranlar</h1>
      {/* Filtreler */}
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm">Yemek Türü</label>
          <select
            className="border rounded px-2 py-1"
            value={filters.cuisines?.[0] || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                cuisines: e.target.value ? [e.target.value] : undefined,
              }))
            }
          >
            <option value="">Tümü</option>
            {cuisineOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Min. Sepet Tutarı</label>
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={filters.min_order ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                min_order: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm">Min. Puan</label>
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={filters.min_rating ?? ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                min_rating: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            min={0}
            max={5}
            step={0.1}
          />
        </div>
        <div>
          <label className="block text-sm">Sırala</label>
          <select
            className="border rounded px-2 py-1"
            value={filters.sort_by || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                sort_by: e.target.value || undefined,
              }))
            }
          >
            <option value="">Varsayılan</option>
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Sıra Yönü</label>
          <select
            className="border rounded px-2 py-1"
            value={filters.sort_order || ""}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                sort_order: (e.target.value as "asc" | "desc") || undefined,
              }))
            }
          >
            <option value="">Varsayılan</option>
            <option value="asc">Artan</option>
            <option value="desc">Azalan</option>
          </select>
        </div>
        <button
          className="ml-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setFilters({})}
        >
          Temizle
        </button>
      </div>
      {/* Liste */}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="border rounded-xl p-4 shadow">
              <h2 className="text-lg font-semibold">{restaurant.name}</h2>
              <p className="text-sm text-gray-600">
                {restaurant.address.city}, {restaurant.address.district}
              </p>
              <p className="text-sm">{restaurant.description}</p>
              <p className="text-sm">Puan: {restaurant.rating_avg}</p>
              <p className="text-sm">
                Min. Sipariş: ₺{restaurant.min_order_price}
              </p>
              <button
                className="mt-2 px-3 py-1 bg-pink-100 hover:bg-pink-200 rounded text-pink-700 text-sm"
                onClick={() => addFavoriteRestaurant(restaurant.id)}
              >
                Favori Ekle
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
