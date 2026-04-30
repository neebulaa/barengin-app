import { useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { FaChevronDown } from "react-icons/fa";

export default function NavDropdown({
    label,
    items = [],
    isOpen,
    onToggle,
    onClose = () => {},
    onNavigate = () => {},
    align = "left",
    className = "",

    // Custom trigger (e.g. avatar)
    trigger = null,
    showChevron = true,

    // Consistent sizing
    menuWidthClass = "w-80",

    // NEW: consistent separators
    withDividers = true,
}) {
    const rootRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (e) => {
            const el = rootRef.current;
            if (!el) return;
            if (!el.contains(e.target)) onClose();
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const MenuItem = ({ item }) => {
        const Icon = item.icon;

        const rowClass =
            "w-full flex items-center gap-3 px-5 py-4 text-left text-base font-medium " +
            "text-neutral-700 hover:bg-primary-50 hover:text-primary-700 transition-colors";

        // POST / button-like (Logout)
        if (item.as === "button") {
            return (
                <Link
                    href={item.href}
                    method={item.method || "post"}
                    as="button"
                    onClick={() => {
                        onNavigate();
                        onClose();
                        item.onClick?.();
                    }}
                    className={rowClass}
                >
                    {Icon ? (
                        <Icon className="w-5 h-5 text-current shrink-0" />
                    ) : null}
                    <span>{item.label}</span>
                </Link>
            );
        }

        // Normal link
        return (
            <Link
                href={item.href}
                onClick={() => {
                    onNavigate();
                    onClose();
                    item.onClick?.();
                }}
                className={rowClass}
            >
                {Icon ? (
                    <Icon className="w-5 h-5 text-current shrink-0" />
                ) : null}
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        <div ref={rootRef} className={["relative", className].join(" ")}>
            {/* Trigger */}
            {trigger ? (
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                    className="focus:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2"
                >
                    {trigger}
                </button>
            ) : (
                <button
                    type="button"
                    className={[
                        "cursor-pointer font-medium transition-colors flex items-center gap-2 focus:outline-none",
                        isOpen
                            ? "text-primary-700"
                            : "text-neutral-700 hover:text-primary-700",
                    ].join(" ")}
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-haspopup="menu"
                >
                    {label}
                    {showChevron && (
                        <FaChevronDown
                            className={[
                                "text-current transition-transform duration-200",
                                isOpen ? "rotate-180" : "",
                            ].join(" ")}
                        />
                    )}
                </button>
            )}

            {/* Menu */}
            {isOpen && (
                <div
                    className={[
                        "absolute mt-3 rounded-xl shadow-lg bg-white border border-neutral-100 z-50 overflow-hidden",
                        menuWidthClass,
                        align === "right" ? "right-0" : "left-0",
                    ].join(" ")}
                    role="menu"
                >
                    <div>
                        {items.map((item, idx) => (
                            <div
                                key={
                                    item.key ||
                                    item.href ||
                                    `${item.label}-${idx}`
                                }
                            >
                                <MenuItem item={item} />

                                {/* Divider between items */}
                                {withDividers && idx !== items.length - 1 && (
                                    <div className="h-px bg-neutral-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
