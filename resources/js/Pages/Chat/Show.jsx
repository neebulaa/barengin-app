import React, { useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Container from "@/Components/Container";
import InputField from "@/Components/Input";
import Button from "@/Components/Button";
import { Link, router, usePage } from "@inertiajs/react";

import Segment from "./Partials/Segment";
import ChatListItem from "./Partials/ChatListItem";
import Bubble from "./Partials/BubbleChat";
import Avatar from "./Partials/Avatar";

import { BiMessageSquareAdd, BiSearch } from "react-icons/bi";
import { FiArrowLeft, FiFilter, FiPaperclip, FiSend } from "react-icons/fi";

import axios from "axios";

function cn(...a) {
    return a.filter(Boolean).join(" ");
}

export default function ChatShow({
    conversations = [],
    conversation,
    messages = [],
}) {
    const authUser = usePage().props?.auth?.user;

    const [tab, setTab] = useState("personal");
    const [q, setQ] = useState("");
    const [filter, setFilter] = useState("all");

    const filtered = useMemo(() => {
        return (conversations ?? [])
            .filter((c) => {
                if (!q) return true;
                return (c.title ?? "").toLowerCase().includes(q.toLowerCase());
            })
            .filter((c) => {
                if (filter === "unread") return Number(c.unread ?? 0) > 0;
                return true;
            });
    }, [conversations, q, filter]);

    const [localMessages, setLocalMessages] = useState(messages ?? []);
    useEffect(() => setLocalMessages(messages ?? []), [conversation?.id]); // reset saat pindah conversation

    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [localMessages?.length]);

    useEffect(() => {
        if (!conversation?.id) return;
        if (!window.Echo) return;

        const channelName = `conversation.${conversation.id}`;
        const channel = window.Echo.private(channelName);

        channel.listen(".message.sent", (payload) => {
            setLocalMessages((prev) => [...(prev ?? []), payload]);
        });

        return () => {
            window.Echo.leave(`private-${channelName}`);
        };
    }, [conversation?.id]);

    useEffect(() => {
        if (!conversation?.id) return;
        axios.post(`/chat/${conversation.id}/read`).catch((err) => {
            console.error("markAsRead failed", err);
        });
    }, [conversation?.id]);

    const [text, setText] = useState("");
    const sendingRef = useRef(false);

    const submit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        if (sendingRef.current) return;

        sendingRef.current = true;

        const optimistic = {
            id: `tmp-${Date.now()}`,
            conversation_id: conversation.id,
            sender_id: authUser?.id,
            text,
            created_at: new Date().toISOString(),
            sender: {
                id: authUser?.id,
                name: authUser?.name,
                avatar: authUser?.public_profile_image,
            },
            optimistic: true,
        };

        setLocalMessages((prev) => [...(prev ?? []), optimistic]);
        setText("");

        router.post(
            `/chat/${conversation.id}/messages`,
            { message_text: optimistic.text },
            {
                preserveScroll: true,
                onFinish: () => {
                    sendingRef.current = false;
                },
                onError: () => {
                    sendingRef.current = false;
                    // rollback optimistic bila perlu
                    setLocalMessages((prev) =>
                        (prev ?? []).filter((m) => m.id !== optimistic.id),
                    );
                    setText(optimistic.text);
                },
            },
        );
    };

    return (
        <>
            <Container className="max-w-[1400px]">
                <div className="min-h-[calc(100vh-96px)] border-l border-r border-neutral-200 md:grid md:grid-cols-[420px_1fr]">
                    {/* LEFT SIDEBAR (hidden on mobile) */}
                    <aside className="hidden border-r border-neutral-200 bg-white px-8 py-8 md:block">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-neutral-700">
                                Chat Messages
                            </h3>

                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                                aria-label="New Chat"
                            >
                                <BiMessageSquareAdd className="text-3xl" />
                            </button>
                        </div>

                        <div className="mt-6">
                            <Segment value={tab} onChange={setTab} />
                        </div>

                        <div className="mt-6">
                            <InputField
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search Chat..."
                                leftIcon={<BiSearch className="text-xl" />}
                                rounded
                                size="md"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFilter("all")}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-sm font-medium transition",
                                        filter === "all"
                                            ? "bg-primary-100 text-primary-700"
                                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                                    )}
                                >
                                    Semua
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFilter("unread")}
                                    className={cn(
                                        "rounded-full px-4 py-2 text-sm font-medium transition",
                                        filter === "unread"
                                            ? "bg-primary-100 text-primary-700"
                                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                                    )}
                                >
                                    Belum Dibaca
                                </button>
                            </div>

                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100"
                                aria-label="Filter"
                            >
                                <FiFilter className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-2">
                            {filtered.map((c) => (
                                <Link key={c.id} href={`/chat/${c.id}`}>
                                    <ChatListItem
                                        active={Number(c.id) === Number(conversation?.id)}
                                        avatar={c.avatar}
                                        title={c.title}
                                        subtitle={c.subtitle}
                                        time={c.time}
                                        unread={c.unread}
                                        onClick={() => {}}
                                    />
                                </Link>
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT CHAT PANEL */}
                    <section className="relative bg-white">
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-neutral-200 px-6 py-5 sm:px-10 sm:py-6">
                            {/* Back only on mobile */}
                            <Link
                                href="/chat"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-neutral-100 md:hidden"
                                aria-label="Back"
                            >
                                <FiArrowLeft className="h-5 w-5 text-neutral-700" />
                            </Link>

                            <Avatar
                                src={conversation?.participants?.[0]?.avatar}
                                alt={conversation?.title ?? "Chat"}
                            />

                            <div className="min-w-0">
                                <div className="truncate text-lg font-semibold text-neutral-700">
                                    {conversation?.title ?? "Chat"}
                                </div>
                                <div className="text-sm text-neutral-500">
                                    {conversation?.is_group
                                        ? `${conversation?.participants?.length ?? 0} Anggota`
                                        : "Online"}
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="h-[calc(100vh-96px-84px-96px)] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
                            <div className="space-y-8">
                                {(localMessages ?? []).map((m) => (
                                    <Bubble
                                        key={m.id}
                                        mine={Number(m.sender_id) === Number(authUser?.id)}
                                        text={m.text}
                                        time={
                                            m.created_at
                                                ? new Date(m.created_at).toLocaleTimeString("id-ID", {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  })
                                                : ""
                                        }
                                        withTicks={Number(m.sender_id) === Number(authUser?.id)}
                                        avatar={m.sender?.avatar}
                                    />
                                ))}
                                <div ref={bottomRef} />
                            </div>
                        </div>

                        {/* Composer */}
                        <div className="border-t border-neutral-200 px-6 py-5 sm:px-10 sm:py-6">
                            <form onSubmit={submit} className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                        <FiPaperclip className="h-5 w-5" />
                                    </div>

                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Your Messages"
                                        className={cn(
                                            "h-14 w-full rounded-full border border-neutral-300 bg-white pl-12 pr-4 text-sm text-neutral-700 placeholder:text-neutral-500",
                                            "focus:border-primary-700 focus:outline-none",
                                        )}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-700 text-white hover:opacity-90"
                                    aria-label="Send"
                                >
                                    <FiSend className="h-6 w-6" />
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </Container>
        </>
    );
}