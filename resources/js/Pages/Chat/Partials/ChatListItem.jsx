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
            className={
                "w-full rounded-2xl px-4 py-3 text-left transition" +
                (isActive ? "bg-primary-50" : "hover:bg-neutral-100")
            }
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

                        <div className="shrink-0 text-xs text-neutral-500">
                            {time}
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

                        {unread ? (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[11px] font-semibold text-white">
                                {unread}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </button>
    );
}