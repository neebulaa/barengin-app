import { useState } from "react";
// import { IoIosBus } from "react-icons/io"; // Kalo ga dipake bisa dihapus aja bro biar bersih

export default function NavbarGuest() {
    // State untuk dropdown desktop & mobile
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // State BARU untuk menu hamburger mobile
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex justify-between items-center">
                
                {/* 1. Logo (Kiri) */}
                <div className="flex-shrink-0 flex items-center">
                    <img
                        src="/assets/barengin_logows.png"
                        className="h-18 w-auto"
                        alt="Barengin"
                    />
                </div>

                {/* 2. Menu Navigasi Desktop (Tengah) */}
                <nav className="hidden md:flex space-x-10 items-center">
                    <a href="#" className="text-gray-900 font-medium hover:text-[#0077D3] transition">
                        Beranda
                    </a>

                    <div className="relative">
                        <button
                            className={`font-medium transition flex items-center gap-1.5 focus:outline-none ${isDropdownOpen ? 'text-[#0077D3]' : 'text-gray-900 hover:text-[#0077D3]'}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            Jalan Bareng
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#0077D3]' : 'text-gray-900'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-3 w-48 rounded-xl shadow-lg bg-white border border-gray-100 z-50 overflow-hidden">
                                <div className="py-2" role="menu">
                                    <a href="/trip-bareng" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0077D3] transition">
                                        Trip Bareng
                                    </a>
                                    <a href="/pergi-bareng" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0077D3] transition">
                                        Pergi Bareng
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <a href="#" className="text-gray-900 font-medium hover:text-[#0077D3] transition">
                        Jastip
                    </a>
                    <a href="#" className="text-gray-900 font-medium hover:text-[#0077D3] transition">
                        Forum
                    </a>
                </nav>

                {/* 3. Tombol Aksi Desktop (Kanan) */}
                <div className="hidden md:flex items-center space-x-6">
                    <a href="/login" className="text-gray-900 font-medium hover:text-[#0077D3] transition">
                        Masuk
                    </a>
                    <a href="/register" className="bg-[#0077D3] text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition">
                        Daftar
                    </a>
                </div>

                {/* 4. Hamburger Menu Button (Mobile) */}
                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Tambahin onClick di sini
                        className="text-gray-600 hover:text-[#0077D3] focus:outline-none transition"
                    >
                        {/* Ganti ikon jadi X kalau menu lagi kebuka */}
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* --- 5. ISI MENU MOBILE (Muncul kalau isMobileMenuOpen = true) --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:text-[#0077D3] hover:bg-gray-50">
                            Beranda
                        </a>
                        
                        {/* Dropdown Mobile untuk Jalan Bareng */}
                        <div className="space-y-1">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex justify-between items-center px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:text-[#0077D3] hover:bg-gray-50 focus:outline-none"
                            >
                                Jalan Bareng
                                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#0077D3]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            {/* Sub-menu Mobile */}
                            {isDropdownOpen && (
                                <div className="pl-6 space-y-1 pb-2">
                                    <a href="/trip-bareng" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#0077D3] hover:bg-gray-50">Trip Bareng</a>
                                    <a href="/pergi-bareng" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#0077D3] hover:bg-gray-50">Pergi Bareng</a>
                                </div>
                            )}
                        </div>

                        <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:text-[#0077D3] hover:bg-gray-50">
                            Jastip
                        </a>
                        <a href="#" className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:text-[#0077D3] hover:bg-gray-50">
                            Forum
                        </a>
                    </div>
                    
                    {/* Tombol Login & Register di Mobile */}
                    <div className="pt-4 pb-6 border-t border-gray-200 px-4 space-y-3">
                        <a href="/login" className="flex justify-center w-full px-4 py-2.5 text-base font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition">
                            Masuk
                        </a>
                        <a href="/register" className="flex justify-center w-full px-4 py-2.5 text-base font-medium text-white bg-[#0077D3] hover:bg-blue-700 rounded-lg transition">
                            Daftar
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}