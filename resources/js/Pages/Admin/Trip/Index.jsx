import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Button from "@/Components/Button";
import { FiSearch, FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiUploadCloud, FiExternalLink, FiAlertCircle } from "react-icons/fi";

const STATUS_STYLES = {
    draft: "bg-blue-100 text-blue-700",
    created: "bg-sky-100 text-sky-700",
    ongoing: "bg-orange-100 text-orange-700",
    done: "bg-green-100 text-green-700",
};

export default function Index({ trips = [] }) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [openMenu, setOpenMenu] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
    const [publishModal, setPublishModal] = useState({ open: false, id: null, name: "" });

    // Urutan status untuk sort "Status": draft → terjadwal → berlangsung → selesai
    const STATUS_ORDER = { draft: 0, created: 1, ongoing: 2, done: 3 };

    const rows = useMemo(() => {
        const q = search.toLowerCase();
        let list = trips.filter((t) => t.name?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q));

        if (sortBy === "seats") list = [...list].sort((a, b) => b.joined - a.joined);
        else if (sortBy === "status") list = [...list].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
        // "latest" -> sudah diurutkan dari server (created_at desc)

        return list;
    }, [trips, search, sortBy]);

    const confirmDelete = () => {
        router.delete(`/admin/trip/${deleteModal.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteModal({ open: false, id: null, name: "" }),
        });
    };
    const confirmPublish = () => {
        router.post(`/admin/trip/${publishModal.id}/publish`, {}, {
            preserveScroll: true,
            onSuccess: () => setPublishModal({ open: false, id: null, name: "" }),
        });
    };

    const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <Head title="Manajemen Trip" />

            {/* Modal hapus */}
            {deleteModal.open && (
                <Modal onClose={() => setDeleteModal({ open: false, id: null, name: "" })}
                    icon={<FiAlertCircle size={32} />} iconClass="bg-red-100 text-red-500"
                    title="Hapus Draft Trip?" body={<>Yakin ingin menghapus <span className="font-bold text-neutral-700">{deleteModal.name}</span>?</>}
                    confirmLabel="Ya, Hapus" confirmClass="bg-red-600 hover:bg-red-700" onConfirm={confirmDelete} />
            )}
            {/* Modal publish */}
            {publishModal.open && (
                <Modal onClose={() => setPublishModal({ open: false, id: null, name: "" })}
                    icon={<FiUploadCloud size={32} />} iconClass="bg-blue-100 text-primary-700"
                    title="Publish Trip?" body={<>Setelah dipublish, <span className="font-bold text-neutral-700">{publishModal.name}</span> akan tampil di Trip Bareng dan <span className="font-semibold">tidak bisa diedit/dihapus lagi</span>.</>}
                    confirmLabel="Ya, Publish" confirmClass="bg-primary-700 hover:bg-blue-700" onConfirm={confirmPublish} />
            )}

            <div className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input type="text" placeholder="Cari trip..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-400 focus:border-primary-700 outline-none text-sm transition-all" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-40 pl-4 pr-10 py-2.5 rounded-xl border border-neutral-400 bg-white text-sm focus:border-primary-700 outline-none cursor-pointer transition-all">
                                <option value="latest">Terbaru</option>
                                <option value="seats">Kursi Terisi</option>
                                <option value="status">Status</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <Button isButtonLink href="/admin/trip/create" size="sm" className="gap-2 whitespace-nowrap">
                            Buat Perjalanan <FiPlus />
                        </Button>
                    </div>
                </div>

                <div className="divide-y divide-neutral-100">
                    {rows.length === 0 && (
                        <div className="py-16 text-center text-neutral-500 text-sm">
                            Belum ada trip. Klik "Buat Perjalanan" untuk membuat draft pertama.
                        </div>
                    )}

                    {rows.map((t) => (
                        <div key={t.id} className="flex items-center gap-4 py-4">
                            <img src={t.image} alt={t.name} className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0"
                                onError={(e) => (e.target.src = "/assets/trip-bareng/list-trip/gunung_bromo/trip_bareng-gunung_bromo-1.jpg")} />

                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-neutral-700 text-sm truncate">{t.name}</p>
                                <p className="text-xs text-neutral-400">{t.date_label}</p>
                            </div>

                            <div className="hidden md:block w-40 text-right">
                                <p className="text-xs text-neutral-400 truncate">{t.location}</p>
                                <p className="font-bold text-neutral-700 text-sm">{rupiah(t.price)}</p>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${STATUS_STYLES[t.status] || "bg-neutral-100 text-neutral-600"}`}>
                                {t.status_label}
                            </span>

                            <div className="hidden sm:block text-xs font-semibold text-primary-700 w-14 text-center shrink-0">
                                {t.joined}/{t.capacity}
                            </div>

                            {/* Menu aksi */}
                            <div className="relative shrink-0">
                                <button onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                                    className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 transition">
                                    <FiMoreVertical size={18} />
                                </button>
                                {openMenu === t.id && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                                        <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 overflow-hidden">
                                            {t.is_draft ? (
                                                <>
                                                    <Link href={`/admin/trip/${t.id}/edit`} onClick={() => setOpenMenu(null)}
                                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                                                        <FiEdit2 size={15} /> Edit Draft
                                                    </Link>
                                                    <button onClick={() => { setOpenMenu(null); setPublishModal({ open: true, id: t.id, name: t.name }); }}
                                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-700 hover:bg-blue-50">
                                                        <FiUploadCloud size={15} /> Publish
                                                    </button>
                                                    <button onClick={() => { setOpenMenu(null); setDeleteModal({ open: true, id: t.id, name: t.name }); }}
                                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                                                        <FiTrash2 size={15} /> Hapus
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {t.status !== "done" && (
                                                        <Link href={`/trip-bareng/${t.id}`} onClick={() => setOpenMenu(null)}
                                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50">
                                                            <FiExternalLink size={15} /> Lihat di Trip Bareng
                                                        </Link>
                                                    )}
                                                    <div className="px-4 py-2.5 text-xs text-neutral-400">Trip sudah dipublish, tidak bisa diedit.</div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Modal({ onClose, icon, iconClass, title, body, confirmLabel, confirmClass, onConfirm }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${iconClass}`}>{icon}</div>
                    <h3 className="text-xl font-bold text-neutral-700 mb-2">{title}</h3>
                    <p className="text-neutral-500 text-sm mb-6 leading-relaxed">{body}</p>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-semibold hover:bg-neutral-50 transition">Batal</button>
                        <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold shadow-sm transition ${confirmClass}`}>{confirmLabel}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => (
    <AdminLayout title="Dasbor - Home" subtitle="Selamat datang, Pemandu!">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-700">Aktivitas Pembuatan Perjalanan</h1>
            <p className="text-neutral-500 text-sm">Kelola trip, publikasikan, dan pantau statusnya.</p>
        </div>
        {page}
    </AdminLayout>
);
