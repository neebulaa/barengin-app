import TripCard from "@/Components/TripCard";

export default function Index({ trips }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative h-[420px] bg-cover bg-center" style={{ backgroundImage: "url('/assets/trips/hero.jpg')" }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Ikuti Trip terbaik di Dunia</h1>
          <p className="text-lg opacity-90">
            Ambil jeda dari stres kehidupan sehari-hari, rencanakan perjalanan, dan jelajahi destinasi favoritmu.
          </p>

          {/* Search Box */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-3">
            <input className="flex-1 border rounded-xl px-4 py-3 text-gray-700" placeholder="Tujuan" />
            <input type="date" className="flex-1 border rounded-xl px-4 py-3 text-gray-700" />
            <input type="date" className="flex-1 border rounded-xl px-4 py-3 text-gray-700" />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Cari
            </button>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Cari Trip Terbaikmu</h2>
          <div className="flex gap-3">
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>Sort By</option>
              <option>Rating Tertinggi</option>
              <option>Harga Termurah</option>
            </select>
            <select className="border rounded-lg px-3 py-2 text-sm">
              <option>Filter By</option>
              <option>Paling Populer</option>
              <option>Baru</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {/* Pagination dummy */}
        <div className="flex justify-center gap-2 mt-10 text-sm">
          <button className="px-3 py-1 rounded border">Prev</button>
          <button className="px-3 py-1 rounded border bg-blue-50">1</button>
          <button className="px-3 py-1 rounded border">2</button>
          <button className="px-3 py-1 rounded border">3</button>
          <button className="px-3 py-1 rounded border">Next</button>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-10 bg-white text-center">
        <img src="/assets/logo.svg" alt="barengin" className="mx-auto h-10 mb-4" />
        <h3 className="font-semibold text-lg">Eksplor Indonesia bersama</h3>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mt-2">
          Mudik dan traveling bukan lagi soal perjalanan sendirian. Temukan teman searah,
          berbagi cerita, dan buat setiap kilometer terasa lebih seru bareng-bareng!
        </p>
      </section>
    </div>
  );
}