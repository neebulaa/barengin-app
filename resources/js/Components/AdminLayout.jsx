import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    FiMenu,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiPieChart,
    FiBarChart2,
    FiTrendingUp,
    FiHome,
    FiUsers,
    FiMessageSquare,
    FiShoppingCart,
} from "react-icons/fi";
import { FaSuitcase, FaCar } from "react-icons/fa6";

export default function AdminLayout({
    children,
    title = "Dasbor - Home",
    subtitle = "Selamat datang, Pemandu!",
}) {
    const { url, props } = usePage();
    const user = props.auth?.user;

    // State untuk Desktop Sidebar (Lebar vs Menyusut)
    const [isCollapsed, setIsCollapsed] = useState(false);
    // State untuk Mobile Sidebar (Sembunyi vs Muncul)
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Data Menu Navigasi
    const navMenus = [
        {
            group: "PEMANDU TRIP",
            short: "TRP",
            items: [
                {
                    name: "Manajemen Trip",
                    icon: <FaSuitcase />,
                    href: "/admin/trip",
                },
                {
                    name: "Analitik Trip",
                    icon: <FiPieChart />,
                    href: "/admin/trip/analytics",
                },
            ],
        },
        {
            group: "JASTIPER",
            short: "JST",
            items: [
                {
                    name: "Manajemen Jastip",
                    icon: <FiShoppingCart />,
                    href: "/admin/jastip",
                },
                {
                    name: "Analitik Jastip",
                    icon: <FiBarChart2 />,
                    href: "/admin/jastip/analytics",
                },
            ],
        },
        {
            group: "PERGI BARENG",
            short: "PBR",
            items: [
                {
                    name: "Manajemen Pergi Bareng",
                    icon: <FaCar />,
                    href: "/admin/pergi-bareng",
                },
                {
                    name: "Analitik Pergi Bareng",
                    icon: <FiTrendingUp />,
                    href: "/admin/pergi-bareng/analytics",
                },
            ],
        },
        {
            group: "ADMIN",
            short: "ADM",
            items: [
                { name: "Beranda Admin", icon: <FiHome />, href: "/admin" },
                {
                    name: "Manajemen User",
                    icon: <FiUsers />,
                    href: "/admin/users",
                },
                {
                    name: "Pesan",
                    icon: <FiMessageSquare />,
                    href: "/admin/messages",
                },
            ],
        },
    ];

    // Cek apakah link sedang aktif
    const isActive = (href) => url.startsWith(href);

    return (
        <div className="min-h-screen bg-[#F4F7FB] flex font-sans">
            <Head title={title} />

            {/* OVERLAY UNTUK MOBILE (Gelap transparan di belakang sidebar) */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-neutral-200 flex flex-col transition-all duration-300 ease-in-out
                    ${isCollapsed ? "w-20" : "w-64"} 
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo & Toggle Button Area */}
                <div className="h-[72px] flex items-center justify-between px-4 border-b border-neutral-100">
                    {/* Logo: Sembunyikan sebagian kalau collapsed */}
                    <div className="flex items-center overflow-hidden h-full">
                        <img
                            src="/assets/barengin_logows.png"
                            alt="Barengin Logo"
                            className={`transition-all duration-300 ${isCollapsed ? "w-10 object-left object-cover" : "w-28"}`}
                        />
                    </div>

                    {/* Tombol Toggle Collapse (Hanya muncul di Desktop) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                    >
                        {isCollapsed ? (
                            <FiChevronRight size={18} />
                        ) : (
                            <FiChevronLeft size={18} />
                        )}
                    </button>

                    {/* Tombol Close Mobile (Hanya muncul di HP) */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden text-neutral-500"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                    {navMenus.map((menu, index) => (
                        <div key={index} className="mb-6">
                            {/* Group Header (Berubah jadi singkatan kalau collapsed) */}
                            <div
                                className={`px-6 mb-3 text-xs font-bold text-neutral-400 tracking-wider transition-all ${isCollapsed ? "text-center text-[10px]" : ""}`}
                            >
                                {isCollapsed ? menu.short : menu.group}
                            </div>

                            <ul className="space-y-1">
                                {menu.items.map((item, idx) => {
                                    const active = isActive(item.href);
                                    return (
                                        <li key={idx} className="px-3">
                                            <Link
                                                href={item.href}
                                                title={
                                                    isCollapsed ? item.name : ""
                                                } // Memunculkan tooltip di hover kalau sedang collapsed
                                                className={`flex items-center rounded-xl transition-all duration-200 group
                                                    ${isCollapsed ? "justify-center py-3" : "px-3 py-3 gap-3"}
                                                    ${active ? "text-[#0077D3]" : "text-neutral-600 hover:bg-neutral-50"}
                                                `}
                                            >
                                                {/* Ikon: Punya background biru solid kalau aktif & collapsed */}
                                                <div
                                                    className={`flex items-center justify-center transition-all 
                                                    ${isCollapsed && active ? "bg-[#0077D3] text-white w-10 h-10 rounded-lg shadow-sm" : "text-lg"}
                                                    ${!isCollapsed && active ? "text-[#0077D3]" : "text-neutral-500 group-hover:text-[#0077D3]"}
                                                `}
                                                >
                                                    {item.icon}
                                                </div>

                                                {/* Teks Menu (Sembunyi kalau collapsed) */}
                                                {!isCollapsed && (
                                                    <span
                                                        className={`font-medium text-sm whitespace-nowrap ${active ? "text-[#0077D3] font-semibold" : ""}`}
                                                    >
                                                        {item.name}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </aside>

            {/* ================= MAIN CONTENT WRAPPER ================= */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
                    ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
                `}
            >
                {/* Top Navbar */}
                <header className="h-[72px] bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
                    {/* Bagian Kiri Navbar */}
                    <div className="flex items-center gap-4">
                        {/* Tombol Hamburger Mobile */}
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden text-neutral-600 hover:text-[#0077D3] focus:outline-none"
                        >
                            <FiMenu size={24} />
                        </button>

                        {/* Title & Subtitle */}
                        <div className="flex flex-col">
                            <h1 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                                {title}
                            </h1>
                            <p className="text-xs sm:text-sm text-neutral-500">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Bagian Kanan Navbar (User Profile) */}
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 focus:outline-none">
                            <img
                                src={
                                    user?.avatar ||
                                    "https://i.pravatar.cc/150?u=admin"
                                }
                                alt="Admin Profile"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                            />
                        </button>
                    </div>
                </header>

                {/* Page Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
