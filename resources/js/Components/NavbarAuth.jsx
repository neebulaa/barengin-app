import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Button from "@/Components/Button.jsx";
import NavDropdown from "@/Components/NavDropdown.jsx";
import NavLink from "@/Components/NavLink.jsx";

import {
    FaRoute,
    FaCarSide,
    FaChevronDown,
    FaPaperPlane,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

export default function NavbarAuth() {
    const { props } = usePage();
    const user = props?.auth?.user;

    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [isMobileUserDropdownOpen, setIsMobileUserDropdownOpen] =
        useState(false);

    const dropdownItems = [
        { label: "Trip Bareng", href: "/trip-bareng", icon: FaRoute },
        { label: "Pergi Bareng", href: "/pergi-bareng", icon: FaCarSide },
    ];

    const avatarUrl =
        user?.avatar_url ||
        user?.profile_photo_url ||
        user?.avatar ||
        "/assets/default-avatar.png";

    const closeAll = () => {
        setIsDesktopDropdownOpen(false);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileUserDropdownOpen(false);
    };

    // Close nested accordions when closing mobile menu
    useEffect(() => {
        if (!isMobileMenuOpen) {
            setIsMobileDropdownOpen(false);
            setIsMobileUserDropdownOpen(false);
        }
    }, [isMobileMenuOpen]);

    return (
        <header className="bg-white border-b border-neutral-200 shadow-sm relative z-50">
            <div className="max-w-[1200px] mx-auto px-4 py-2 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={closeAll}
                >
                    <img
                        src="/assets/barengin_logows.png"
                        className="h-15 w-auto"
                        alt="Barengin"
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex space-x-6 items-center text-neutral-700">
                    <NavLink href="/">Beranda</NavLink>

                    <NavDropdown
                        label="Jalan Bareng"
                        items={dropdownItems}
                        isOpen={isDesktopDropdownOpen}
                        onToggle={() => setIsDesktopDropdownOpen((v) => !v)}
                        onNavigate={() => setIsDesktopDropdownOpen(false)}
                        onClose={() => setIsDesktopDropdownOpen(false)}
                        menuWidthClass="w-60"
                        withDividers
                    />

                    <NavLink href="/jastip">Jastip</NavLink>
                    <NavLink href="/forum">Forum</NavLink>
                    <NavLink href="/leaderboard">Leaderboard</NavLink>
                </nav>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <Button
                        isButtonLink
                        href="/chat"
                        type="primary"
                        variant="solid"
                        size="sm"
                        className="gap-2"
                    >
                        <FaPaperPlane className="w-4 h-4" />
                        Chat
                    </Button>

                    {/* Profile dropdown uses NavDropdown trigger (avatar), like Jalan Bareng */}
                    <NavDropdown
                        items={[
                            {
                                label: "Dashboard",
                                href: "/dashboard",
                                icon: MdDashboard,
                            },
                            {
                                label: "Profile History",
                                href: "/profile/history",
                                icon: HiOutlineDocumentText,
                            },
                            {
                                label: "Logout",
                                href: "/logout",
                                icon: FiLogOut,
                                as: "button",
                                method: "post",
                            },
                        ]}
                        isOpen={isProfileOpen}
                        onToggle={() => setIsProfileOpen((v) => !v)}
                        onNavigate={() => setIsProfileOpen(false)}
                        onClose={() => setIsProfileOpen(false)}
                        align="right"
                        menuWidthClass="w-80"
                        withDividers
                        trigger={
                            <img
                                src={avatarUrl}
                                alt={user?.name || "Profile"}
                                className="w-10 h-10 rounded-full object-cover border border-neutral-200 shadow-sm"
                            />
                        }
                        showChevron={false}
                    />
                </div>

                {/* Mobile hamburger */}
                <div className="md:hidden flex items-center">
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                        className="text-neutral-600 hover:text-primary-700 focus:outline-none transition-colors cursor-pointer"
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu (pattern matches NavbarGuest, plus User accordion) */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-neutral-100 absolute w-full left-0 shadow-lg">
                    {/* User accordion (like Jalan Bareng) */}
                    <div className="px-4 pt-3 pb-2 border-b border-neutral-200">
                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileUserDropdownOpen((v) => !v)
                            }
                            className="w-full flex justify-between items-center px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                            aria-expanded={isMobileUserDropdownOpen}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <img
                                    src={avatarUrl}
                                    alt={user?.name || "User"}
                                    className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                                />
                                <span className="truncate">
                                    {user?.name || "User"}
                                </span>
                            </div>

                            <FaChevronDown
                                className={[
                                    "text-neutral-600 transition-transform duration-200 shrink-0",
                                    isMobileUserDropdownOpen
                                        ? "rotate-180"
                                        : "",
                                ].join(" ")}
                            />
                        </button>

                        {isMobileUserDropdownOpen && (
                            <div className="mt-1 pl-2 space-y-1">
                                <Link
                                    href="/dashboard"
                                    onClick={closeAll}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-neutral-600 hover:text-primary-700 hover:bg-neutral-50 transition-colors flex items-center"
                                >
                                    <MdDashboard className="w-5 h-5 mr-2 text-current" />
                                    Dashboard
                                </Link>

                                <Link
                                    href="/profile/history"
                                    onClick={closeAll}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-neutral-600 hover:text-primary-700 hover:bg-neutral-50 transition-colors flex items-center"
                                >
                                    <HiOutlineDocumentText className="w-5 h-5 mr-2 text-current" />
                                    Profile History
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onClick={closeAll}
                                    className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-neutral-600 hover:text-primary-700 hover:bg-neutral-50 transition-colors flex items-center cursor-pointer"
                                >
                                    <FiLogOut className="w-5 h-5 mr-2 text-current" />
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Main mobile nav */}
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link
                            href="/"
                            onClick={closeAll}
                            className="block px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 transition-colors"
                        >
                            Beranda
                        </Link>

                        <div className="px-3 py-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileDropdownOpen((v) => !v)
                                }
                                className="w-full flex justify-between items-center rounded-md text-base font-medium text-neutral-700 hover:text-primary-700 focus:outline-none transition-colors cursor-pointer"
                                aria-expanded={isMobileDropdownOpen}
                            >
                                Jalan Bareng
                                <FaChevronDown
                                    className={[
                                        "text-neutral-600 transition-transform duration-200",
                                        isMobileDropdownOpen
                                            ? "rotate-180"
                                            : "",
                                    ].join(" ")}
                                />
                            </button>

                            {isMobileDropdownOpen && (
                                <div className="mt-2 pl-2 space-y-1">
                                    {dropdownItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeAll}
                                            className="block px-3 py-3 rounded-md text-base font-medium text-neutral-600 hover:text-primary-700 hover:bg-neutral-50 transition-colors flex items-center"
                                        >
                                            {item.icon ? (
                                                <item.icon className="w-4 h-4 mr-2 text-current" />
                                            ) : null}
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            href="/jastip"
                            onClick={closeAll}
                            className="block px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 transition-colors"
                        >
                            Jastip
                        </Link>

                        <Link
                            href="/forum"
                            onClick={closeAll}
                            className="block px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 transition-colors"
                        >
                            Forum
                        </Link>

                        <Link
                            href="/leaderboard"
                            onClick={closeAll}
                            className="block px-3 py-3 rounded-md text-base font-medium text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 transition-colors"
                        >
                            Leaderboard
                        </Link>
                    </div>

                    {/* Mobile actions */}
                    <div className="pt-4 pb-6 border-t border-neutral-200 px-4 space-y-3">
                        <Button
                            isButtonLink
                            href="/chat"
                            type="primary"
                            variant="solid"
                            className="w-full gap-2"
                            onClick={closeAll}
                        >
                            <FaPaperPlane className="w-4 h-4" />
                            Chat
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
