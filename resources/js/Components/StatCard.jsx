// Kartu statistik ringkas untuk dashboard admin (ikon + label + nilai besar).
// Sebelumnya komponen ini didefinisikan ulang secara lokal di Beranda dan tiap
// halaman Analytics (Trip/PergiBareng/Jastip). `value` diterima apa adanya -
// pemanggil yang memformat (rupiah, persen, atau angka) supaya fleksibel.
export default function StatCard({ icon, label, value, suffix }) {
    return (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
            <div className="flex items-center gap-2 text-neutral-500 text-sm mb-2">
                <span className="text-primary-700">{icon}</span> {label}
            </div>
            <p className="text-2xl font-bold text-neutral-700">
                {value}
                {suffix && (
                    <span className="ml-1 text-sm font-medium text-neutral-400">{suffix}</span>
                )}
            </p>
        </div>
    );
}
