import React from "react";
import Avatar from "./Avatar";

function cn(...a) {
    return a.filter(Boolean).join(" ");
}

export default function Bubble({ mine, text, time, withTicks, avatar }) {
    return (
        <div className={cn("flex w-full", mine ? "justify-end" : "justify-start")}>
            <div className="flex max-w-[560px] items-end gap-3">
                {!mine ? (
                    <Avatar src={avatar} alt="avatar" className="h-9 w-9" />
                ) : null}

                <div
                    className={cn(
                        "rounded-xl border border-primary-700 bg-white px-4 py-3",
                        mine ? "rounded-br-sm" : "rounded-bl-sm",
                    )}
                >
                    <div className="whitespace-pre-line text-sm text-neutral-700">
                        {text}
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-neutral-500">
                        <span>{time}</span>
                        {mine && withTicks ? (
                            <span className="text-primary-700">✓✓</span>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}