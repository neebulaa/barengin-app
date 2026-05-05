import React, { useEffect, useMemo, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import Container from "@/Components/Container";
import MainLayout from "@/Layouts/MainLayout";

import ForumSideNav from "./Partials/ForumSideNav";
import ForumBackLink from "./Partials/ForumBackLink";
import PostCard from "./Partials/PostCard";
import ResponseSortBar from "./Partials/ResponseSortBar";
import ResponseItem from "./Partials/ResponseItem";
import CommentComposer from "./Partials/CommentComposer";

export default function PostShow() {
    const { post, comments, responseCount, sort, auth } = usePage().props;

    const [localComments, setLocalComments] = useState(comments ?? []);
    const tempIdRef = useRef(0);

    // ✅ Critical fix: ONLY reset on explicit sort change (not on reload after posting)
    const lastSortRef = useRef(sort);
    useEffect(() => {
        if (lastSortRef.current !== sort) {
            setLocalComments(comments ?? []);
            lastSortRef.current = sort;
        }
    }, [sort, comments]);

    const postCard = useMemo(() => {
        return {
            id: post.id,
            author: post.user?.name ?? "Unknown",
            avatar: post.user?.avatar ?? "/assets/default-profile.png",
            time: formatRelativeTime(post.created_at),
            content: post.content,
            likes: compactNumber(post.likes ?? 0),
            comments: compactNumber(responseCount ?? 0),
            tags: (post.tags ?? []).map((t) => t.tag_name),
            images: (post.images ?? []).map((img) => img.url),
        };
    }, [post, responseCount]);

    const responses = useMemo(() => {
        return (localComments ?? []).map((c) => ({
            id: c.id,
            author: c.user?.name ?? "Unknown",
            avatar: c.user?.avatar ?? "/assets/default-profile.png",
            time: formatRelativeTime(c.created_at),
            text: c.comment_text,
            likes: compactNumber(c.likes ?? 0),
            userId: c.user?.id,
            replies: sortRepliesOldestFirst(c.replies ?? []).map((r) => ({
                id: r.id,
                author: r.user?.name ?? "Unknown",
                avatar: r.user?.avatar ?? "/assets/default-profile.png",
                time: formatRelativeTime(r.created_at),
                text: r.comment_text,
                likes: compactNumber(r.likes ?? 0),
                userId: r.user?.id,
            })),
        }));
    }, [localComments]);

    const submitNewComment = (text) => {
        if (!auth?.user) return;

        const nowIso = new Date().toISOString();
        const tempId = `temp_c_${Date.now()}_${++tempIdRef.current}`;

        const optimistic = {
            id: tempId,
            comment_text: text,
            likes: 0,
            created_at: nowIso,
            __optimistic: true,
            user: {
                id: auth.user.id,
                name: auth.user.full_name ?? "You",
                avatar:
                    auth.user.public_profile_image ??
                    "/assets/default-profile.png",
            },
            replies: [],
        };

        // ✅ Always pinned to top (even when sort=popular)
        setLocalComments((prev) => [optimistic, ...(prev ?? [])]);

        router.post(
            `/forum/posts/${post.id}/comments`,
            { comment_text: text },
            {
                preserveScroll: true,
                onError: () => {
                    setLocalComments((prev) =>
                        (prev ?? []).filter((c) => c.id !== tempId),
                    );
                },
                onSuccess: () => {
                    // reload ONLY to get server IDs/counts, but do NOT reset ordering
                    router.reload({
                        only: ["comments", "responseCount", "post"],
                        preserveScroll: true,
                        onSuccess: (page) => {
                            const serverComments = page.props.comments ?? [];
                            const real = findMatchingServerComment({
                                serverComments,
                                userId: auth.user.id,
                                commentText: text,
                            });

                            // Replace optimistic in-place => no jump
                            setLocalComments((prev) => {
                                const arr = [...(prev ?? [])];
                                const idx = arr.findIndex(
                                    (c) => c.id === tempId,
                                );
                                if (idx === -1) return arr;
                                arr[idx] = real
                                    ? real
                                    : { ...arr[idx], __optimistic: false };
                                return arr;
                            });
                        },
                    });
                },
            },
        );
    };

    const submitReply = (commentId, text) => {
        if (!auth?.user) return;

        const nowIso = new Date().toISOString();
        const tempId = `temp_r_${Date.now()}_${++tempIdRef.current}`;

        const optimisticReply = {
            id: tempId,
            comment_text: text,
            likes: 0,
            created_at: nowIso,
            __optimistic: true,
            user: {
                id: auth.user.id,
                name: auth.user.full_name ?? "You",
                avatar:
                    auth.user.public_profile_image ??
                    "/assets/default-profile.png",
            },
        };

        // ✅ Replies always append at bottom
        setLocalComments((prev) =>
            (prev ?? []).map((c) => {
                if (String(c.id) !== String(commentId)) return c;
                return {
                    ...c,
                    replies: [
                        ...sortRepliesOldestFirst(c.replies ?? []),
                        optimisticReply,
                    ],
                };
            }),
        );

        router.post(
            `/forum/comments/${commentId}/replies`,
            { comment_text: text },
            {
                preserveScroll: true,
                onError: () => {
                    setLocalComments((prev) =>
                        (prev ?? []).map((c) => {
                            if (String(c.id) !== String(commentId)) return c;
                            return {
                                ...c,
                                replies: (c.replies ?? []).filter(
                                    (r) => r.id !== tempId,
                                ),
                            };
                        }),
                    );
                },
                onSuccess: () => {
                    // reload only to sync replies IDs, but keep replies bottom
                    router.reload({
                        only: ["comments", "responseCount"],
                        preserveScroll: true,
                        onSuccess: (page) => {
                            const serverComments = page.props.comments ?? [];
                            const serverParent = serverComments.find(
                                (c) => String(c.id) === String(commentId),
                            );
                            if (!serverParent) return;

                            setLocalComments((prev) =>
                                (prev ?? []).map((c) => {
                                    if (String(c.id) !== String(commentId))
                                        return c;
                                    return {
                                        ...c,
                                        replies: sortRepliesOldestFirst(
                                            serverParent.replies ?? [],
                                        ),
                                    };
                                }),
                            );
                        },
                    });
                },
            },
        );
    };

    return (
        <div className="bg-white lg:pl-28">
            <ForumSideNav />

            <Container className="py-10">
                <div className="max-w-3xl">
                    <div className="mb-6">
                        <ForumBackLink href="/forum" label="Kembali" />
                    </div>

                    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                        <PostCard post={postCard} />

                        <ResponseSortBar
                            sort={sort ?? "popular"}
                            onChangeSort={(nextSort) => {
                                router.get(
                                    `/forum/posts/${post.id}`,
                                    { sort: nextSort },
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                );
                            }}
                            responseCount={responseCount ?? 0}
                        />

                        <CommentComposer
                            placeholder="Tulis komentar..."
                            submitLabel="Kirim"
                            onSubmit={submitNewComment}
                        />

                        <div>
                            {responses.map((r) => (
                                <ResponseItem
                                    key={r.id}
                                    response={r}
                                    onReplySubmit={submitReply}
                                    currentUserId={auth?.user?.id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

PostShow.layout = (page) => <MainLayout>{page}</MainLayout>;

function findMatchingServerComment({ serverComments, userId, commentText }) {
    const matches = (serverComments ?? []).filter(
        (c) =>
            String(c.user?.id ?? "") === String(userId) &&
            String(c.comment_text ?? "") === String(commentText ?? ""),
    );
    return matches.length ? matches[0] : null;
}

function sortRepliesOldestFirst(replies) {
    return [...(replies ?? [])].sort((a, b) => {
        const ta = new Date(a.created_at ?? 0).getTime();
        const tb = new Date(b.created_at ?? 0).getTime();
        return ta - tb;
    });
}

function formatRelativeTime(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 0) return "baru saja";
    if (diffSeconds < 60) return "baru saja";

    const minutes = Math.floor(diffSeconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} minggu lalu`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} bulan lalu`;

    const years = Math.floor(days / 365);
    return `${years} tahun lalu`;
}

function compactNumber(n) {
    const num = Number(n ?? 0);
    if (!Number.isFinite(num)) return "0";

    const format = (value, suffix) => {
        const s = value.toFixed(1);
        return `${s.endsWith(".0") ? s.slice(0, -2) : s}${suffix}`;
    };

    if (num >= 1_000_000_000) return format(num / 1_000_000_000, "B");
    if (num >= 1_000_000) return format(num / 1_000_000, "M");
    if (num >= 1_000) return format(num / 1_000, "k");
    return String(num);
}
