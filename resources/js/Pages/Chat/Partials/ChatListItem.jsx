import React from "react";
import Avatar from "./Avatar";

function cn(...a) {
    return a.filter(Boolean).join(" ");
}

export default function ChatListItem({
    active,
    avatar,
    title,
    subtitle,
    time,
    unread,
    badgeLabel,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-full rounded-2xl px-4 py-3 text-left transition",
                active ? "bg-primary-50" : "hover:bg-neutral-100",
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar src={avatar} alt={title} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="truncate text-[15px] font-semibold text-neutral-700">
                                {title}
                            </div>
                            <div className="truncate text-sm text-neutral-500">
                                {subtitle}
                            </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-end gap-2">
                            <span className="text-xs text-neutral-500">
                                {time}
                            </span>
                            {unread ? (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[11px] font-semibold text-white">
                                    {unread}
                                </span>
                            ) : (
                                <div className="h-5" /> 
                            )}
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        {badgeLabel ? (
                            <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700">
                                {badgeLabel}
                            </span>
                        ) : (
                            <span />
                        )}

                        
                    </div>
                </div>
            </div>
        </button>
    );
}