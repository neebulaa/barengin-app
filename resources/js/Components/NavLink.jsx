import { Link } from "@inertiajs/react";
export default function NavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="font-medium text-neutral-700 hover:text-primary-700 transition-colors"
        >
            {children}
        </Link>
    );
}
