import React from "react";

export default function ChatListItem({
    isActive,
    avatar,
    title,
    subtitle,
    time,
    unread,
    onClick,
    badgeLabel
}){
    return(
        <button
            type="button"
            onClick={onClick}
            className={"w-full rounded-2xl px-4 py-3 text-left transition ", isActive ? "bg-primary-50": "hover:bg-neutral-100"}

        >

        </button>
    );
}