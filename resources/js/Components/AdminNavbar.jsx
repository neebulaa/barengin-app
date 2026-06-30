import React, { useState, useRef, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function AdminNavbar({ title, subtitle, setIsMobileOpen }) {
    // Ambil data user dari Inertia
    const { props } = usePage();
    const user = props.auth?.user;

    // State untuk toggle dropdown profil
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Fungsi untuk menutup dropdown kalau diklik di luar kotak
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-[72px] bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
            {/* Bagian Kiri Navbar */}
            <div className="flex items-center gap-4">
                {/* Tombol Hamburger Mobile */}
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden text-neutral-600 hover:text-primary-700 focus:outline-none transition-colors"
                >
                    <FiMenu size={24} />
                </button>

                {/* Title & Subtitle */}
                <div className="flex flex-col">
                    <h1 className="text-base sm:text-lg font-bold text-neutral-700 leading-tight">
                        {title}
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-500">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Bagian Kanan Navbar (User Profile) */}
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                >
                    <img
                        src={user?.public_profile_image ?? "/assets/default-profile.png"}
                        alt={user?.name ?? "Admin Profile"}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 shadow-sm cursor-pointer"
                    />
                </button>

                {/* --- DROPDOWN MENU PROFILE --- */}
                {isProfileOpen && (
                    <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-100 z-50 overflow-hidden animate-fade-in-up">
                        <Link
                            href="/"
                            className="w-full flex items-center gap-3 px-5 py-4 text-base font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-neutral-200"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            <MdHome className="w-5 h-5 text-current shrink-0" />
                            <span>Beranda</span>
                        </Link>

                        <Link
                            href="/profile-history"
                            className="w-full flex items-center gap-3 px-5 py-4 text-base font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-neutral-200"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            <HiOutlineDocumentText className="w-5 h-5 text-current shrink-0" />
                            <span>Riwayat Profil</span>
                        </Link>

                        {/* Logout menggunakan POST method sesuai bawaan Laravel Breeze/Jetstream */}
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-5 py-4 text-base font-medium text-neutral-600 hover:bg-primary-50 hover:text-primary-700 transition-colors cursor-pointer"
                        >
                            <FiLogOut className="w-5 h-5 text-current shrink-0" />
                            <span>Keluar</span>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}