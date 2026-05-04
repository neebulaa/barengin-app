import React, { useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { FiHome, FiSearch, FiPlus, FiUser } from "react-icons/fi";

function NavIconButton({ icon, href = "#", active = false, label }) {
    return (
        <Link
            href={href}
            aria-label={label}
            className={[
                "h-12 w-12 rounded-xl flex items-center justify-center transition",
                active
                    ? "bg-primary-700 text-white shadow-sm"
                    : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100",
            ].join(" ")}
        >
            <span className="text-xl">{icon}</span>
        </Link>
    );
}

export default function ForumSideNav() {
    // Optional: mark active based on URL if you want
    const { url } = usePage();
    const activeKey = useMemo(() => {
        if (url?.includes("/forum")) return "home";
        return "home";
    }, [url]);

    const items = [
        { key: "home", label: "Home", icon: <FiHome />, href: "/forum" },
        { key: "search", label: "Search", icon: <FiSearch />, href: "#" },
        { key: "create", label: "Create", icon: <FiPlus />, href: "#" },
        { key: "profile", label: "Profile", icon: <FiUser />, href: "#" },
    ];

    return (
        <>
            {/* Desktop left rail */}
            <div className="hidden lg:block fixed left-0 top-0 h-full w-28 bg-white border-r border-neutral-200">
                <div className="h-20" />
                <div className="flex flex-col items-center gap-4 py-6">
                    {items.map((it) => (
                        <NavIconButton
                            key={it.key}
                            icon={it.icon}
                            href={it.href}
                            label={it.label}
                            active={activeKey === it.key}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200">
                <div className="px-4 py-3 flex items-center justify-around">
                    {items.map((it) => (
                        <NavIconButton
                            key={it.key}
                            icon={it.icon}
                            href={it.href}
                            label={it.label}
                            active={activeKey === it.key}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}