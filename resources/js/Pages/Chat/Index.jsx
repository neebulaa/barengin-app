import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Container from "@/Components/Container";
import InputField from "@/Components/Input";
import Button from "@/Components/Button";
import NavAuth from "@/Components/NavbarAuth"

import Segment from "./Partials/Segment";
import ChatListItem from "./Partials/ChatListItem";
import Bubble from "./Partials/BubbleChat";
import Avatar from "./Partials/Avatar";

import { BiMessageSquareAdd, BiSearch } from "react-icons/bi";
import { FiFilter, FiPaperclip, FiSend, FiArrowLeft } from "react-icons/fi";

function cn(...a) {
    return a.filter(Boolean).join(" ");
}

export default function ChatIndex() {
    const [tab, setTab] = useState("personal");
    const [q, setQ] = useState("");
    const [filter, setFilter] = useState("all");
    const [mobileView, setMobileView] = useState("list");

    const personalChats = [
        {
            id: "u1",
            avatar: "https://i.pravatar.cc/120?img=5",
            title: "Jane Cooper",
            subtitle: "gatau sih waitt",
            time: "08:50",
            unread: 0,
            headerTitle: "Jane Cooper",
            headerSub: "Online",
        },
        {
            id: "u2",
            avatar: "/assets/default-profile.png",
            title: "Jungkukchan",
            subtitle: "ini wtsnya diambil",
            time: "08:50",
            unread: 2,
            headerTitle: "Jungkukchan",
            headerSub: "Online",
        },
        {
            id: "u3",
            avatar: "https://i.pravatar.cc/120?img=12",
            title: "Yuki",
            subtitle: "nanti yaa baru ku up lagi",
            time: "08:50",
            unread: 0,
            headerTitle: "Yuki",
            headerSub: "Online",
        },
        {
            id: "u4",
            avatar: "/assets/default-profile.png",
            title: "Lister Chan",
            subtitle: "sipp broo",
            time: "08:50",
            unread: 0,
            headerTitle: "Lister Chan",
            headerSub: "Online",
        },
    ];

    const groupChats = [
        {
            id: "g1",
            avatar: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=200&h=200&fit=crop",
            title: "Pergi ke Stasiun Bogor",
            subtitle: "Nga sabar nih..",
            time: "08:50",
            unread: 0,
            badgeLabel: "Pergi Bareng",
            headerTitle: "Pergi ke Stasiun Bogor",
            headerSub: "4 Anggota",
        },
        {
            id: "g2",
            avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
            title: "Trip Canbur",
            subtitle: "Gaiss see you esok!!",
            time: "08:50",
            unread: 0,
            badgeLabel: "Trip Bareng",
            headerTitle: "Trip Canbur",
            headerSub: "6 Anggota",
        },
    ];

    const chats = tab === "personal" ? personalChats : groupChats;

    const [activeId, setActiveId] = useState(chats?.[0]?.id);

    useEffect(() => {
        setActiveId((prev) => {
            const exists = (chats ?? []).some((c) => c.id === prev);
            return exists ? prev : chats?.[0]?.id;
        });
    }, [tab]);

    const activeChat = useMemo(
        () => (chats ?? []).find((c) => c.id === activeId) ?? chats?.[0],
        [activeId, chats],
    );

    const filteredChats = useMemo(() => {
        const base = chats ?? [];
        return base
            .filter((c) => {
                if (!q) return true;
                const hit =
                    (c.title ?? "").toLowerCase().includes(q.toLowerCase()) ||
                    (c.subtitle ?? "").toLowerCase().includes(q.toLowerCase());
                return hit;
            })
            .filter((c) => {
                if (filter === "unread") return Number(c.unread ?? 0) > 0;
                return true;
            });
    }, [chats, q, filter]);

    const messages = [
        {
            id: 1,
            mine: false,
            text: "Hello Rudi,\nSaya adalah orang yang ingin ini itu semoga ininya di itukan.\nKuda Jaran cuy",
            time: "08.33",
        },
        {
            id: 2,
            mine: false,
            text: "Hello Rudi,\nSaya adalah orang yang ingin ini itu\nsemoga ininya di itukan.",
            time: "08.33",
        },
        {
            id: 3,
            mine: true,
            text: "Hello, Jgane",
            time: "08.39",
            withTicks: true,
        },
        {
            id: 4,
            mine: true,
            text: "Semoga yang diiinikan segera\ndiitukan yaa 🙌",
            time: "08.39",
            withTicks: true,
        },
    ];

    const [message, setMessage] = useState("");
    const submit = (e) => {
        e.preventDefault();
        setMessage("");
    };

    const openChat = (id) => {
        setActiveId(id);
        setMobileView("chat");
    };

    const goBackToList = () => {
        setMobileView("list");
    };

    useEffect(() => {
        if (!activeConversation?.id) return;

        const channel = window.Echo?.private(`conversation.${activeConversation.id}`);

        channel?.listen(".message.sent", (payload) => {
            setLocalMessages((prev) => [...(prev ?? []), payload]);
        });

        return () => {
            window.Echo?.leave(`private-conversation.${activeConversation.id}`);
        };
    }, [activeConversation?.id]);

    return (
        <>
            <NavAuth />
            <Container className="max-w-[1400px]">
                <div
                    className={cn(
                        "min-h-[calc(100vh-96px)] border-l border-r border-neutral-200",
                        "md:grid md:grid-cols-[420px_1fr]",
                    )}
                >
                    {/* LEFT SIDEBAR */}
                    <aside
                        className={cn(
                            "border-neutral-200 bg-white px-6 py-6 sm:px-8 sm:py-8",
                            "md:border-r",
                            mobileView === "chat" ? "hidden md:block" : "block",
                        )}
                    >
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
                            {filteredChats.map((c) => (
                                <ChatListItem
                                    key={c.id}
                                    active={c.id === activeId}
                                    avatar={c.avatar}
                                    title={c.title}
                                    subtitle={c.subtitle}
                                    time={c.time}
                                    unread={c.unread}
                                    badgeLabel={c.badgeLabel}
                                    onClick={() => openChat(c.id)}
                                />
                            ))}
                        </div>
                    </aside>

                    {/* RIGHT CHAT PANEL */}
                    <section
                        className={cn(
                            "relative bg-white",
                            mobileView === "list" ? "hidden md:block" : "block",
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-neutral-200 px-6 py-5 sm:px-10 sm:py-6">
                            {/* Back button hanya muncul di mobile */}
                            <button
                                type="button"
                                onClick={goBackToList}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-neutral-100 md:hidden"
                                aria-label="Back"
                            >
                                <FiArrowLeft className="h-5 w-5 text-neutral-700" />
                            </button>

                            <Avatar
                                src={activeChat?.avatar}
                                alt={activeChat?.headerTitle ?? "Chat"}
                            />

                            <div className="min-w-0">
                                <div className="truncate text-lg font-semibold text-neutral-700">
                                    {activeChat?.headerTitle ?? "Chat"}
                                </div>
                                <div
                                    className={cn(
                                        "text-sm",
                                        tab === "personal"
                                            ? "text-success-700"
                                            : "text-neutral-500",
                                    )}
                                >
                                    {activeChat?.headerSub ?? ""}
                                </div>
                            </div>

                            {/* <div className="ml-auto hidden md:block">
                                <Button
                                    type="primary"
                                    variant="soft"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => {}}
                                >
                                    View
                                </Button>
                            </div> */}
                        </div>

                        {/* Body */}
                        <div className="h-[calc(100vh-96px-84px-96px)] overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
                            <div className="space-y-8">
                                {messages.map((m) => (
                                    <Bubble
                                        key={m.id}
                                        mine={m.mine}
                                        text={m.text}
                                        time={m.time}
                                        withTicks={m.withTicks}
                                        avatar={activeChat?.avatar}
                                    />
                                ))}

                                {/* placeholder image bubble */}
                                <div className="flex w-full justify-end">
                                    <div className="w-full max-w-[560px] rounded-xl border border-primary-700 bg-white p-3">
                                        <div className="h-44 w-full rounded-lg bg-neutral-900" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Composer */}
                        <div className="border-t border-neutral-200 px-6 py-5 sm:px-10 sm:py-6">
                            <form
                                onSubmit={submit}
                                className="flex items-center gap-4"
                            >
                                <div className="relative flex-1">
                                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                                        <FiPaperclip className="h-5 w-5" />
                                    </div>

                                    <input
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
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