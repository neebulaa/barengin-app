import { Heart } from "lucide-react";

export default function TripCard({ trip }) {
  const {
    title,
    location,
    date,
    capacity,
    rating,
    reviews,
    price,
    guide,
    guide_badge,
    image,
    liked,
  } = trip;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      <div className="relative">
        <img src={image} alt={title} className="h-44 w-full object-cover" />
        <button className="absolute right-3 top-3 bg-white/90 rounded-full p-2 shadow">
          <Heart className={`h-5 w-5 ${liked ? "text-red-500" : "text-gray-500"}`} />
        </button>
        <div className="absolute left-3 bottom-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          5 sisa (5 kursi lagi)
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{location}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>📅 {date}</div>
          <div>🧑‍🤝‍🧑 {capacity}</div>
          <div>⭐ {rating} ({reviews} ulasan)</div>
          <div>🧭 Rating Trip</div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="text-xs">
            <div className="font-semibold">{guide}</div>
            <div className="text-yellow-500">{guide_badge}</div>
          </div>
          <button className="ml-auto text-xs px-3 py-1 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50">
            Chat Pemandu
          </button>
        </div>

        <div className="flex items-center pt-2">
          <div className="text-sm font-semibold">Rp {price.toLocaleString("id-ID")} <span className="text-xs font-normal">/ orang</span></div>
          <button className="ml-auto text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700">
            Ikut Trip
          </button>
        </div>
      </div>
    </div>
  );
}