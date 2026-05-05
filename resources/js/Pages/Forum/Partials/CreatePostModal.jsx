import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    FiArrowLeft,
    FiBold,
    FiImage,
    FiItalic,
    FiMapPin,
    FiSearch,
    FiTarget,
    FiX,
} from "react-icons/fi";

import IconButton from "./IconButton";
import Toggle from "@/Components/Toggle";
import Button from "@/Components/Button";

function PreviewMedia({ images }) {
    if (!images?.length) return null;

    if (images.length === 1) {
        return (
            <div className="mt-4">
                <img
                    src={images[0].preview}
                    alt="preview"
                    className="w-full h-64 md:h-72 object-cover rounded-2xl"
                />
            </div>
        );
    }

    return (
        <div className="mt-4">
            <div className="flex gap-3 overflow-x-auto pb-1 pr-1 snap-x snap-mandatory scrollbar-slim">
                {images.map((img, idx) => (
                    <div
                        key={img.id}
                        className="snap-start shrink-0 overflow-hidden rounded-2xl bg-neutral-100 w-64 sm:w-72 md:w-80"
                    >
                        <img
                            src={img.preview}
                            alt={`preview ${idx + 1}`}
                            className="h-52 w-full object-cover md:h-60"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function LocationPickerView({ query, onChangeQuery, onBack, onSelect }) {
    const items = useMemo(() => {
        const data = [
            { name: "Jakarta, Indonesia", meta: "100+ Post" },
            { name: "Plaza Indonesia", meta: "50+ Post" },
            { name: "Bandung, Indonesia", meta: "30+ Post" },
            { name: "Bali, Indonesia", meta: "200+ Post" },
        ];

        const qq = (query ?? "").trim().toLowerCase();
        if (!qq) return data;
        return data.filter((x) => x.name.toLowerCase().includes(qq));
    }, [query]);

    return (
        <div className="px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
                <button
                    type="button"
                    onClick={onBack}
                    className="h-9 w-9 rounded-lg hover:bg-neutral-100 inline-flex items-center justify-center"
                    aria-label="Back"
                >
                    <FiArrowLeft />
                </button>

                <div className="flex-1 text-center font-semibold">
                    Search Location
                </div>

                <div className="w-9" />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2">
                <FiSearch className="text-neutral-500" />
                <input
                    value={query}
                    onChange={(e) => onChangeQuery?.(e.target.value)}
                    className="w-full outline-none text-sm"
                    placeholder="Cari Lokasi..."
                />
                <button
                    type="button"
                    className="h-9 w-9 rounded-lg hover:bg-neutral-100 inline-flex items-center justify-center"
                    aria-label="Use current location"
                    onClick={() => onSelect?.("Current Location")}
                >
                    <FiTarget />
                </button>
            </div>

            <div className="mt-4 space-y-2">
                {items.map((x) => (
                    <button
                        key={x.name}
                        type="button"
                        onClick={() => onSelect?.(x.name)}
                        className="w-full text-left rounded-xl px-3 py-3 hover:bg-neutral-50 border border-neutral-100"
                    >
                        <div className="font-medium text-sm text-neutral-900">
                            {x.name}
                        </div>
                        <div className="text-xs text-neutral-500">{x.meta}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function getPlainTextFromHtml(html) {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
}

export default function CreatePostModal({ open, onClose, user, onSubmit }) {
    const [view, setView] = useState("editor"); // "editor" | "location"
    const [disableComments, setDisableComments] = useState(false);

    const [location, setLocation] = useState("");
    const [locationQuery, setLocationQuery] = useState("");

    const [images, setImages] = useState([]);

    // WYSIWYG content as HTML
    const [contentHtml, setContentHtml] = useState("");

    const fileInputRef = useRef(null);
    const editorRef = useRef(null);

    const canPost = useMemo(() => {
        const text = getPlainTextFromHtml(contentHtml);
        return text.length > 0 || images.length > 0;
    }, [contentHtml, images]);

    // keep editor DOM in sync when opening/closing
    useEffect(() => {
        if (!open) return;
        // focus editor when modal opens
        setTimeout(() => {
            editorRef.current?.focus();
        }, 0);
    }, [open]);

    const exec = (cmd) => {
        // Keep focus in editor so selection/caret is preserved
        editorRef.current?.focus();
        document.execCommand(cmd);
        // sync state from DOM
        setContentHtml(editorRef.current?.innerHTML ?? "");
    };

    const handlePickImages = () => fileInputRef.current?.click();

    const handleFiles = (files) => {
        const next = Array.from(files ?? []).map((f) => ({
            id: `${f.name}_${f.size}_${f.lastModified}_${Math.random()}`,
            file: f,
            preview: URL.createObjectURL(f),
        }));

        setImages((prev) => [...(prev ?? []), ...next]);
    };

    const closeAndCleanup = () => {
        images.forEach((x) => {
            try {
                URL.revokeObjectURL(x.preview);
            } catch {}
        });

        setView("editor");
        setDisableComments(false);
        setLocation("");
        setLocationQuery("");
        setImages([]);
        setContentHtml("");

        if (editorRef.current) editorRef.current.innerHTML = "";

        onClose?.();
    };

    const backToEditor = () => {
        setView("editor");
        setLocationQuery("");
        setTimeout(() => editorRef.current?.focus(), 0);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={closeAndCleanup}
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                        <div className="font-semibold">
                            {view === "editor" ? "New Post" : "Location"}
                        </div>
                        <button
                            type="button"
                            onClick={closeAndCleanup}
                            className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
                        >
                            <FiX />
                            Cancel
                        </button>
                    </div>

                    {/* Body */}
                    {view === "editor" ? (
                        <div className="px-6 py-5">
                            <div className="flex gap-4">
                                <img
                                    src={
                                        user?.public_profile_image ??
                                        "/assets/default-profile.png"
                                    }
                                    alt="avatar"
                                    className="h-12 w-12 rounded-full object-cover"
                                />

                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-neutral-900">
                                        {user?.full_name ?? "Anda"}
                                    </div>

                                    {location ? (
                                        <div className="text-xs text-neutral-500 mt-0.5">
                                            {location}
                                        </div>
                                    ) : null}

                                    {/* WYSIWYG editor */}
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        className={[
                                            "mt-3 w-full min-h-[96px] outline-none",
                                            "text-neutral-900",
                                            "whitespace-pre-wrap break-words",
                                        ].join(" ")}
                                        data-placeholder="Apa yang Baru?"
                                        onInput={(e) =>
                                            setContentHtml(
                                                e.currentTarget.innerHTML ?? "",
                                            )
                                        }
                                        onPaste={(e) => {
                                            // paste as plain text to avoid weird styles
                                            e.preventDefault();
                                            const text =
                                                e.clipboardData.getData(
                                                    "text/plain",
                                                );
                                            document.execCommand(
                                                "insertText",
                                                false,
                                                text,
                                            );
                                            setContentHtml(
                                                editorRef.current?.innerHTML ??
                                                    "",
                                            );
                                        }}
                                    />

                                    {/* Placeholder styling for contentEditable */}
                                    <style>{`
                                      [contenteditable][data-placeholder]:empty:before {
                                        content: attr(data-placeholder);
                                        color: #a3a3a3;
                                      }
                                    `}</style>

                                    <PreviewMedia images={images} />

                                    {/* Toolbar */}
                                    <div className="mt-4 flex items-center gap-2 text-neutral-700">
                                        <IconButton
                                            label="Upload Image"
                                            onClick={handlePickImages}
                                        >
                                            <FiImage className="text-xl" />
                                        </IconButton>

                                        <IconButton
                                            label="Location"
                                            onClick={() => setView("location")}
                                        >
                                            <FiMapPin className="text-xl" />
                                        </IconButton>

                                        <IconButton
                                            label="Italic"
                                            onClick={() => exec("italic")}
                                        >
                                            <FiItalic className="text-xl" />
                                        </IconButton>

                                        <IconButton
                                            label="Bold"
                                            onClick={() => exec("bold")}
                                        >
                                            <FiBold className="text-xl" />
                                        </IconButton>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                handleFiles(e.target.files);
                                                e.target.value = "";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <LocationPickerView
                            query={locationQuery}
                            onChangeQuery={setLocationQuery}
                            onBack={backToEditor}
                            onSelect={(loc) => {
                                setLocation(loc);
                                backToEditor();
                            }}
                        />
                    )}

                    {/* Footer (only in editor view) */}
                    {view === "editor" ? (
                        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                            <Toggle
                                id="disable-comments"
                                name="disable-comments"
                                checked={disableComments}
                                onChange={(next) => setDisableComments(next)}
                                label="Nonaktifkan Komentar"
                            />

                            <Button
                                onClick={() => {
                                    if (!canPost) return;

                                    const content_text =
                                        getPlainTextFromHtml(contentHtml);

                                    onSubmit?.({
                                        content_html: contentHtml,
                                        content_text,
                                        location,
                                        allows_comment: !disableComments,
                                        images: images.map((x) => x.file),
                                    });

                                    closeAndCleanup();
                                }}
                                type="neutral"
                                variant="outline"
                                rounded
                                className={[
                                    "px-10",
                                    !canPost
                                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                                        : "",
                                ].join(" ")}
                            >
                                Post
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
