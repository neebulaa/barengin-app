import React, { useMemo, useState } from "react";
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
    const { post, comments, responseCount, sort } = usePage().props;

    // Local state so we can append new comments/replies in UI (frontend only)
    const [localComments, setLocalComments] = useState(comments ?? []);

    const postCard = useMemo(() => {
        return {
            id: post.id,
            author: post.user?.name ?? "Unknown",
            avatar: post.user?.avatar ?? "/assets/default-profile.png",
            time: "baru",
            content: post.content,
            likes: String(post.likes ?? 0),
            comments: String(responseCount ?? 0),
            tags: (post.tags ?? []).map((t) => t.tag_name),
            images: (post.images ?? []).map((img) => img.url),
        };
    }, [post, responseCount]);

    // Map controller comments -> ResponseItem shape (but keep replies array)
    const responses = useMemo(() => {
        return (localComments ?? []).map((c) => ({
            id: c.id,
            author: c.user?.name ?? "Unknown",
            avatar: c.user?.avatar ?? "/assets/default-profile.png",
            time: "baru",
            text: c.comment_text,
            likes: c.likes ?? 0,
            replies: (c.replies ?? []).map((r) => ({
                id: r.id,
                author: r.user?.name ?? "Unknown",
                avatar: r.user?.avatar ?? "/assets/default-profile.png",
                time: "baru",
                text: r.comment_text,
            })),
        }));
    }, [localComments]);

    const submitNewComment = (text) => {
        // Frontend-only add (replace later with API POST)
        const temp = {
            id: `temp_${Date.now()}`,
            comment_text: text,
            likes: 0,
            created_at: new Date().toISOString(),
            user: {
                name: "You",
                avatar: "/assets/default-profile.png",
            },
            replies: [],
        };

        setLocalComments((prev) => [temp, ...prev]);
    };

    const submitReply = (commentId, text) => {
        setLocalComments((prev) =>
            prev.map((c) => {
                if (c.id !== commentId) return c;

                const reply = {
                    id: `temp_r_${Date.now()}`,
                    comment_text: text,
                    likes: 0,
                    created_at: new Date().toISOString(),
                    user: {
                        name: "You",
                        avatar: "/assets/default-profile.png",
                    },
                };

                return { ...c, replies: [...(c.replies ?? []), reply] };
            }),
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

                        {/* Comment composer (new comment) */}
                        <CommentComposer
                            placeholder="Tulis komentar..."
                            submitLabel="Kirim"
                            onSubmit={submitNewComment}
                        />

                        {/* Responses */}
                        <div>
                            {responses.map((r) => (
                                <ResponseItem
                                    key={r.id}
                                    response={r}
                                    onReplySubmit={submitReply}
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
