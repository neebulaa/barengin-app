import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
    currentPage = 1,
    totalPages = 10,
    onPageChange = () => {},
    className = "",
}) {
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        if (currentPage <= 3) {
            return [1, 2, 3,"...", totalPages - 1, totalPages];
        }
        
        if (currentPage >= totalPages - 2) {
            return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
        }
        
        return [1, "...", currentPage, "...", totalPages];
    };

    const pages = getPageNumbers();

    return (
        <div className={`flex items-center justify-center gap-3 ${className}`}>
            
            {/* --- Tombol Prev --- */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-1.5 px-2 py-2 text-sm font-medium transition-colors ${
                    currentPage === 1
                        ? "text-neutral-300 cursor-not-allowed" // Warna abu-abu pudar saat disabled
                        : "text-neutral-700 hover:text-primary-700 cursor-pointer"
                }`}
            >
                <FaChevronLeft className="w-3.5 h-3.5" />
                Prev
            </button>

            {/* --- Angka Halaman --- */}
            <div className="flex items-center gap-1.5">
                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 text-sm font-medium"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-primary-50 border border-primary-500 text-primary-700" // Warna Aktif (Biru)
                                    : "bg-neutral-50 border border-transparent text-neutral-700 hover:bg-neutral-200" // Warna Tidak Aktif (Abu-abu muda)
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* --- Tombol Next --- */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1.5 px-2 py-2 text-sm font-medium transition-colors ${
                    currentPage === totalPages
                        ? "text-neutral-300 cursor-not-allowed"
                        : "text-neutral-700 hover:text-primary-700 cursor-pointer"
                }`}
            >
                Next
                <FaChevronRight className="w-3.5 h-3.5" />
            </button>
            
        </div>
    );
}