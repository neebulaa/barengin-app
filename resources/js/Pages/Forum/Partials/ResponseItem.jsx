import React, { useMemo, useState } from "react";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import CommentComposer from "./CommentComposer";

function ReplyRow({ reply }) {
    return (
        <div className="pl-12 pt-3">
            <div className="flex gap-3">
                <img
                    src={reply.avatar}
                    alt={reply.author}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-neutral-900 text-sm">
                            {reply.author}
                        </p>
                        <span className="text-xs text-neutral-500">
                            {reply.time}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
                        {reply.text}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResponseItem({ response, onReplySubmit }) {
    const [openReplyComposer, setOpenReplyComposer] = useState(false);
    const [openReplies, setOpenReplies] = useState(false);

    const replyCount = useMemo(
        () => response.replies?.length ?? 0,
        [response.replies],
    );

    return (
        <div className="px-5 py-4 border-t border-neutral-200">
            <div className="flex gap-3">
                <img
                    src={response.avatar}
                    alt={response.author}
                    className="h-9 w-9 rounded-full object-cover shrink-0"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-neutral-900">
                            {response.author}
                        </p>
                        <span className="text-xs text-neutral-500">
                            {response.time}
                        </span>
                    </div>

                    <p className="mt-1 text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
                        {response.text}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-5 text-neutral-600">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 hover:text-neutral-900 transition text-sm"
                        >
                            <FiHeart className="text-base" />
                            {response.likes}
                        </button>

                        {/* Toggle replies ONLY when clicking the comment icon */}
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 hover:text-neutral-900 transition text-sm"
                            onClick={() => setOpenReplies((v) => !v)}
                            aria-expanded={openReplies}
                            aria-controls={`replies-${response.id}`}
                            disabled={replyCount === 0}
                        >
                            <FiMessageCircle className="text-base" />
                            {replyCount}
                        </button>

                        {/* Reply composer toggle */}
                        <button
                            type="button"
                            className="text-sm font-medium hover:text-neutral-900 transition"
                            onClick={() => setOpenReplyComposer((v) => !v)}
                        >
                            Balas
                        </button>
                    </div>

                    {/* Reply composer (level 2) */}
                    {openReplyComposer ? (
                        <div className="mt-3 pl-12">
                            <CommentComposer
                                compact
                                placeholder="Tulis balasan..."
                                submitLabel="Balas"
                                onCancel={() => setOpenReplyComposer(false)}
                                onSubmit={(text) => {
                                    onReplySubmit?.(response.id, text);

                                    // optional: auto-open replies after replying
                                    setOpenReplies(true);

                                    setOpenReplyComposer(false);
                                }}
                            />
                        </div>
                    ) : null}

                    {/* Replies list (collapsed by default) */}
                    {openReplies && replyCount > 0 ? (
                        <div id={`replies-${response.id}`} className="mt-2">
                            {response.replies.map((r) => (
                                <ReplyRow key={r.id} reply={r} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
