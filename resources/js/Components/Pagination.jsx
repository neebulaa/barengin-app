import React from "react";

export default function Pagination({ 
    currentPage = 1, 
    totalPages = 10, 
    onPageChange = () => {} 
}) {
    const getVisiblePages = () => {
        const pages = [];
        
        // Always show first page
        pages.push(1);
        
        // Show pages around current
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        if (start > 2) pages.push("...");
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        if (end < totalPages - 1) pages.push("...");
        
        // Always show last page if more than 1
        if (totalPages > 1) pages.push(totalPages);
        
        return pages;
    };

    const pages = getVisiblePages();

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm text-neutral-500 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                &lt; Prev
            </button>

            {pages.map((page, idx) => (
                <React.Fragment key={idx}>
                    {page === "..." ? (
                        <span className="px-2 text-neutral-400">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                page === currentPage
                                    ? "bg-primary-700 text-white"
                                    : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-700"
                            }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm text-neutral-500 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Next &gt;
            </button>
        </div>
    );
}