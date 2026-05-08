import React, { useEffect, useMemo, useState } from "react";
import Container from "@/Components/Container";
import InputField from "@/Components/Input";
import Button from "@/Components/Button";
import NavAuth from "@/Components/NavbarAuth"
import { Link } from "@inertiajs/react";

import Segment from "./Partials/Segment";
import ChatListItem from "./Partials/ChatListItem";
import Bubble from "./Partials/BubbleChat";
import Avatar from "./Partials/Avatar";
import NewChatModal from "./Partials/NewChatModal";

import { BiMessageSquareAdd, BiSearch } from "react-icons/bi";
import { FiFilter, FiPaperclip, FiSend, FiArrowLeft } from "react-icons/fi";

function cn(...a) {
    return a.filter(Boolean).join(" ");
}

export default function ChatIndex({conversations = []}) {
    const [tab, setTab] = useState("personal");
    const [q, setQ] = useState("");
    const [filter, setFilter] = useState("all");
    const [openNewChat, setOpenNewChat] = useState(false);

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

    // const personalChats = [
    //     {
    //         id: "u1",
    //         avatar: "https://i.pravatar.cc/120?img=5",
    //         title: "Jane Cooper",
    //         subtitle: "gatau sih waitt",
    //         time: "08:50",
    //         unread: 0,
    //         headerTitle: "Jane Cooper",
    //         headerSub: "Online",
    //     },
    //     {
    //         id: "u2",
    //         avatar: "/assets/default-profile.png",
    //         title: "Jungkukchan",
    //         subtitle: "ini wtsnya diambil",
    //         time: "08:50",
    //         unread: 2,
    //         headerTitle: "Jungkukchan",
    //         headerSub: "Online",
    //     },
    //     {
    //         id: "u3",
    //         avatar: "https://i.pravatar.cc/120?img=12",
    //         title: "Yuki",
    //         subtitle: "nanti yaa baru ku up lagi",
    //         time: "08:50",
    //         unread: 0,
    //         headerTitle: "Yuki",
    //         headerSub: "Online",
    //     },
    //     {
    //         id: "u4",
    //         avatar: "/assets/default-profile.png",
    //         title: "Lister Chan",
    //         subtitle: "sipp broo",
    //         time: "08:50",
    //         unread: 0,
    //         headerTitle: "Lister Chan",
    //         headerSub: "Online",
    //     },
    // ];

    // const groupChats = [
    //     {
    //         id: "g1",
    //         avatar: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=200&h=200&fit=crop",
    //         title: "Pergi ke Stasiun Bogor",
    //         subtitle: "Nga sabar nih..",
    //         time: "08:50",
    //         unread: 0,
    //         badgeLabel: "Pergi Bareng",
    //         headerTitle: "Pergi ke Stasiun Bogor",
    //         headerSub: "4 Anggota",
    //     },
    //     {
    //         id: "g2",
    //         avatar: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=200&h=200&fit=crop",
    //         title: "Trip Canbur",
    //         subtitle: "Gaiss see you esok!!",
    //         time: "08:50",
    //         unread: 0,
    //         badgeLabel: "Trip Bareng",
    //         headerTitle: "Trip Canbur",
    //         headerSub: "6 Anggota",
    //     },
    // ];

    // const chats = tab === "personal" ? personalChats : groupChats;

    // const [activeId, setActiveId] = useState(chats?.[0]?.id);

    // useEffect(() => {
    //     setActiveId((prev) => {
    //         const exists = (chats ?? []).some((c) => c.id === prev);
    //         return exists ? prev : chats?.[0]?.id;
    //     });
    // }, [tab]);

    // const activeChat = useMemo(
    //     () => (chats ?? []).find((c) => c.id === activeId) ?? chats?.[0],
    //     [activeId, chats],
    // );

    // const filteredChats = useMemo(() => {
    //     const base = chats ?? [];
    //     return base
    //         .filter((c) => {
    //             if (!q) return true;
    //             const hit =
    //                 (c.title ?? "").toLowerCase().includes(q.toLowerCase()) ||
    //                 (c.subtitle ?? "").toLowerCase().includes(q.toLowerCase());
    //             return hit;
    //         })
    //         .filter((c) => {
    //             if (filter === "unread") return Number(c.unread ?? 0) > 0;
    //             return true;
    //         });
    // }, [chats, q, filter]);

    // const messages = [
    //     {
    //         id: 1,
    //         mine: false,
    //         text: "Hello Rudi,\nSaya adalah orang yang ingin ini itu semoga ininya di itukan.\nKuda Jaran cuy",
    //         time: "08.33",
    //     },
    //     {
    //         id: 2,
    //         mine: false,
    //         text: "Hello Rudi,\nSaya adalah orang yang ingin ini itu\nsemoga ininya di itukan.",
    //         time: "08.33",
    //     },
    //     {
    //         id: 3,
    //         mine: true,
    //         text: "Hello, Jgane",
    //         time: "08.39",
    //         withTicks: true,
    //     },
    //     {
    //         id: 4,
    //         mine: true,
    //         text: "Semoga yang diiinikan segera\ndiitukan yaa 🙌",
    //         time: "08.39",
    //         withTicks: true,
    //     },
    // ];

    // const [message, setMessage] = useState("");
    // const submit = (e) => {
    //     e.preventDefault();
    //     setMessage("");
    // };

    // const openChat = (id) => {
    //     setActiveId(id);
    //     setMobileView("chat");
    // };

    // const goBackToList = () => {
    //     setMobileView("list");
    // };

    // useEffect(() => {
    //     if (!activeConversation?.id) return;

    //     const channel = window.Echo?.private(`conversation.${activeConversation.id}`);

    //     channel?.listen(".message.sent", (payload) => {
    //         setLocalMessages((prev) => [...(prev ?? []), payload]);
    //     });

    //     return () => {
    //         window.Echo?.leave(`private-conversation.${activeConversation.id}`);
    //     };
    // }, [activeConversation?.id]);

    return (
        <>
            <NavAuth />
            <Container className="max-w-[1400px]">
                <div className="min-h-[calc(100vh-96px)] border-l border-r border-neutral-200 md:grid md:grid-cols-[420px_1fr]">
                    {/* LEFT SIDEBAR */}
                    <aside className="border-neutral-200 bg-white px-6 py-6 sm:px-8 sm:py-8 md:border-r">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-neutral-700">
                                Chat Messages
                            </h3>

                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                                aria-label="New Chat"
                            >
                                <button
                                type="button"
                                onClick={() => setOpenNewChat(true)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                                aria-label="New Chat"
                                >
                                <BiMessageSquareAdd className="text-3xl" />
                                </button>

                                <NewChatModal open={openNewChat} onClose={() => setOpenNewChat(false)} />
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
                            <div className="flex items-center gap-2">
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
                                        active={false}
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

                    {/* RIGHT PANEL placeholder (desktop only) */}
                    <section className="hidden items-center justify-center bg-white md:flex">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-neutral-700">
                                Pilih chat untuk mulai
                            </div>
                            <div className="mt-2 text-sm text-neutral-500">
                                Di mobile, klik salah satu chat dari list.
                            </div>
                        </div>
                    </section>
                </div>
            </Container>
            <NewChatModal open={openNewChat} onClose={() => setOpenNewChat(false)} />
        </>
    );
}