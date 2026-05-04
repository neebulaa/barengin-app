import React from "react";
import { Link } from "@inertiajs/react";
import { FiChevronLeft } from "react-icons/fi";

export default function ForumBackLink({ href = "/forum", label = "Kembali" }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 hover:text-neutral-900"
        >
            <FiChevronLeft className="text-lg" />
            {label}
        </Link>
    );
}
