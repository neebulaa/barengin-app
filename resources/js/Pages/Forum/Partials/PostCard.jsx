import React from "react";
import { Link } from "@inertiajs/react";
import TagPillList from "./TagPillList";
import { FiHeart, FiMessageCircle } from "react-icons/fi";

function PostMediaScroll({ images = [] }) {
    if (!images.length) return null;

    return (
        <div className="mt-4">
            <div className="flex gap-3 overflow-x-auto pb-1 pr-1 snap-x snap-mandatory scrollbar-slim">
                {images.map((src, idx) => (
                    <div
                        key={idx}
                        className="snap-start shrink-0 overflow-hidden rounded-2xl bg-neutral-100 w-64 sm:w-72 md:w-80"
                    >
                        <img
                            src={src}
                            alt={`Post media ${idx + 1}`}
                            className="h-52 w-full object-cover md:h-60"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PostCard({ post, onTagClick }) {
    return (
        <article className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="p-5 flex gap-4">
                <img
                    src={post.avatar}
                    alt={post.author}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-neutral-900">
                            {post.author}
                        </h3>
                        <span className="text-sm text-neutral-500">
                            {post.time}
                        </span>
                    </div>

                    <p className="mt-1 text-neutral-800 leading-relaxed">
                        {post.content}
                    </p>

                    {post.tags?.length ? (
                        <div className="mt-3">
                            {/* ✅ clickable tags on the post */}
                            <TagPillList
                                tags={post.tags}
                                onTagClick={onTagClick}
                            />
                        </div>
                    ) : null}

                    <PostMediaScroll images={post.images} />

                    <div className="mt-4 flex items-center gap-5 text-neutral-600">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 hover:text-neutral-800 transition"
                        >
                            <FiHeart className="text-lg" />
                            <span className="text-sm">{post.likes}</span>
                        </button>

                        <Link
                            href={`/forum/posts/${post.id}`}
                            className="inline-flex items-center gap-2 hover:text-neutral-800 transition"
                        >
                            <FiMessageCircle className="text-lg" />
                            <span className="text-sm">{post.comments}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
