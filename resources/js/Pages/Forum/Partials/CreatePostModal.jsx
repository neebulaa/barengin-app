import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    FiArrowLeft,
    FiBold,
    FiHash,
    FiImage,
    FiItalic,
    FiMapPin,
    FiSearch,
    FiTarget,
    FiX,
} from "react-icons/fi";

import IconButton from "./IconButton";
import TagPill from "./TagPill";
import Toggle from "@/Components/Toggle";
import Button from "@/Components/Button";

/**
 * CHIP MODEL (supports spaces):
 * - Tags are NOT parsed from inline "#...".
 * - Users add tags via the suggestion box, which creates chips.
 * - Chips are always highlighted (separate UI), no caret/DOM fighting.
 * - Content text stays WYSIWYG for bold/italic only.
 *
 * On submit, we send:
 * - content_html
 * - tag_names[] (strings, can include spaces)
 */

/** ---------- Media preview with remove ---------- */
function PreviewMedia({ images, onRemove }) {
    if (!images?.length) return null;

    const RemoveBtn = ({ id }) => (
        <button
            type="button"
            onClick={() => onRemove?.(id)}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white inline-flex items-center justify-center hover:bg-black/70"
            aria-label="Remove image"
        >
            <FiX className="w-4 h-4" />
        </button>
    );

    if (images.length === 1) {
        const img = images[0];
        return (
            <div className="mt-2 mb-3 relative">
                <img
                    src={img.preview}
                    alt="preview"
                    className="w-full h-40 md:h-64 object-cover rounded-2xl"
                />
                <RemoveBtn id={img.id} />
            </div>
        );
    }

    return (
        <div className="mt-2 mb-3">
            <div className="flex gap-3 overflow-x-auto pb-1 pr-1 snap-x snap-mandatory scrollbar-slim">
                {images.map((img, idx) => (
                    <div
                        key={img.id}
                        className="relative snap-start shrink-0 overflow-hidden rounded-2xl bg-neutral-100 w-64 sm:w-72 md:w-80"
                    >
                        <img
                            src={img.preview}
                            alt={`preview ${idx + 1}`}
                            className="h-40 w-full object-cover md:h-48"
                            loading="lazy"
                        />
                        <RemoveBtn id={img.id} />
                    </div>
                ))}
            </div>
        </div>
    );
}

/** ---------- Location view (same modal, no overlap) ---------- */
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
        <div className="px-6 py-5 flex-1 overflow-y-auto">
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

function normalizeTagName(name) {
    return String(name ?? "")
        .replace(/^#/, "")
        .replace(/\s+/g, " ")
    .toLowerCase()
        .trim();
}

export default function CreatePostModal({
    open,
    onClose,
    user,
    onSubmit,
    tags = [], // [{id, tag_name}]
}) {
    const [view, setView] = useState("editor"); // "editor" | "location"
    const [disableComments, setDisableComments] = useState(false);

    const [location, setLocation] = useState("");
    const [locationQuery, setLocationQuery] = useState("");

    const [images, setImages] = useState([]);

    const [contentHtml, setContentHtml] = useState("");

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

    const [chipTags, setChipTags] = useState([]); // array of tag_name strings (can include spaces)

    const [tagBoxOpen, setTagBoxOpen] = useState(false);
    const [tagQuery, setTagQuery] = useState("");

    const fileInputRef = useRef(null);
    const editorRef = useRef(null);
    const tagInputRef = useRef(null);
    const tagBoxRef = useRef(null);
    const [suggestionStyle, setSuggestionStyle] = useState({});

    const canPost = useMemo(() => {
        const text = getPlainTextFromHtml(contentHtml);
        return text.length > 0 || images.length > 0;
    }, [contentHtml, images]);

    const tagNames = useMemo(
        () =>
            (tags ?? [])
                .map((t) => normalizeTagName(t.tag_name))
                .filter(Boolean),
        [tags],
    );

    const SUGGESTION_LIMIT = 3;

    const filteredTagSuggestions = useMemo(() => {
        const q = normalizeTagName(tagQuery).toLowerCase();
        if (!tagBoxOpen) return [];

        if (!q) return tagNames.slice(0, SUGGESTION_LIMIT);

        return tagNames
            .filter((t) => t.toLowerCase().includes(q))
            .slice(0, SUGGESTION_LIMIT);
    }, [tagBoxOpen, tagQuery, tagNames]);

    const syncFormatState = () => {
        try {
            setIsBold(Boolean(document.queryCommandState("bold")));
            setIsItalic(Boolean(document.queryCommandState("italic")));
        } catch {
            // ignore
        }
    };

    const syncHtmlFromDom = () => {
        setContentHtml(editorRef.current?.innerHTML ?? "");
    };

    const hydrateDomFromState = () => {
        if (!editorRef.current) return;
        const current = editorRef.current.innerHTML ?? "";
        if (current !== (contentHtml ?? "")) {
            editorRef.current.innerHTML = contentHtml ?? "";
        }
    };

    useEffect(() => {
        if (!open) return;

        setTimeout(() => {
            hydrateDomFromState();
            editorRef.current?.focus();
            syncFormatState();
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (!open || view !== "editor") return;

        const onSel = () => syncFormatState();
        document.addEventListener("selectionchange", onSel);
        return () => document.removeEventListener("selectionchange", onSel);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, view]);

    useEffect(() => {
        if (!tagBoxOpen) return;

        const handleClickOutside = (e) => {
            if (tagBoxRef.current && !tagBoxRef.current.contains(e.target)) {
                setTagBoxOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [tagBoxOpen]);

    // Set suggestion box to appear below input and sit on top (set once on open)
    useEffect(() => {
        if (!tagBoxOpen) return;

        const input = tagInputRef.current;
        if (!input) return;
        const rect = input.getBoundingClientRect();

        setSuggestionStyle({
            position: "fixed",
            left: `${rect.left}px`,
            top: `${rect.bottom + 8}px`,
            width: `${rect.width}px`,
            zIndex: 99999,
        });
    }, [tagBoxOpen]);

    const exec = (cmd) => {
        editorRef.current?.focus();
        document.execCommand(cmd);
        syncHtmlFromDom();
        syncFormatState();
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

    const removeImage = (id) => {
        setImages((prev) => {
            const img = (prev ?? []).find((x) => x.id === id);
            if (img?.preview) {
                try {
                    URL.revokeObjectURL(img.preview);
                } catch {}
            }
            return (prev ?? []).filter((x) => x.id !== id);
        });
    };

    const goToLocation = () => {
        syncHtmlFromDom();
        setView("location");
        setTagBoxOpen(false);
    };

    const backToEditor = () => {
        setView("editor");
        setLocationQuery("");
        setTimeout(() => {
            hydrateDomFromState();
            editorRef.current?.focus();
            syncFormatState();
        }, 0);
    };

    const addChipTag = (name) => {
        const normalized = normalizeTagName(name);
        if (!normalized) return;

        setChipTags((prev) => {
            const exists = (prev ?? []).some(
                (t) => t.toLowerCase() === normalized.toLowerCase(),
            );
            if (exists) return prev ?? [];
            return [...(prev ?? []), normalized];
        });

        setTagQuery("");
        setTagBoxOpen(false);

        // keep typing tags quickly
        setTimeout(() => tagInputRef.current?.focus(), 0);
    };

    const removeChipTag = (name) => {
        setChipTags((prev) =>
            (prev ?? []).filter(
                (t) => t.toLowerCase() !== String(name).toLowerCase(),
            ),
        );
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
        setIsBold(false);
        setIsItalic(false);

        setChipTags([]);
        setTagBoxOpen(false);
        setTagQuery("");

        if (editorRef.current) editorRef.current.innerHTML = "";

        onClose?.();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            <div
                className="absolute inset-0 flex items-center justify-center p-4 bg-black/40"
                onClick={(e) => {
                    e.stopPropagation();
                    if (e.target === e.currentTarget) {
                        closeAndCleanup();
                    }
                }}
            >
                <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col">
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
                        <div className="px-6 py-5 flex-1 overflow-y-auto">
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
                                        <div className="text-xs text-neutral-500 my-0.5">
                                            <FiMapPin className="inline mr-1" />
                                            {location}
                                        </div>
                                    ) : null}

                                    {/* WYSIWYG editor (bold/italic only) */}
                                    <div
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        className={[
                                            "w-full outline-none",
                                            "text-neutral-700",
                                            "whitespace-pre-wrap break-words",
                                            "min-h-[32px]",
                                            "max-h-30 md:max-h-32 overflow-y-auto",
                                            "py-1 text-sm",
                                        ].join(" ")}
                                        data-placeholder="Apa yang Baru?"
                                        onInput={() => {
                                            syncHtmlFromDom();
                                            syncFormatState();
                                        }}
                                        onKeyUp={syncFormatState}
                                        onMouseUp={syncFormatState}
                                        onPaste={(e) => {
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
                                            syncHtmlFromDom();
                                            syncFormatState();
                                        }}
                                    />

                                    <style>{`
                                      [contenteditable][data-placeholder]:empty:before {
                                        content: attr(data-placeholder);
                                        color: #a3a3a3;
                                      }
                                    `}</style>

                                    <PreviewMedia
                                        images={images}
                                        onRemove={removeImage}
                                    />

                                    {/* Tag chips + tag input (chip model) */}
                                    <div className="">
                                        {chipTags.length ? (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {chipTags.map((t) => (
                                                    <TagPill
                                                        cursor="default"
                                                        key={t}
                                                        tag={t}
                                                        onRemove={() =>
                                                            removeChipTag(t)
                                                        }
                                                        fontSize="xs"
                                                    />
                                                ))}
                                            </div>
                                        ) : null}

                                        <div
                                            className="relative"
                                            ref={tagBoxRef}
                                        >
                                            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2">
                                                <FiHash className="text-neutral-500" />
                                                <input
                                                    ref={tagInputRef}
                                                    value={tagQuery}
                                                    onChange={(e) => {
                                                        setTagQuery(
                                                            e.target.value.toLowerCase(),
                                                        );
                                                        if (!tagBoxOpen) {
                                                            const input =
                                                                tagInputRef.current;
                                                            if (input) {
                                                                const rect =
                                                                    input.getBoundingClientRect();
                                                                setSuggestionStyle(
                                                                    {
                                                                        position:
                                                                            "fixed",
                                                                        left: `${rect.left}px`,
                                                                        top: `${rect.bottom + 8}px`,
                                                                        width: `${rect.width}px`,
                                                                        zIndex: 99999,
                                                                    },
                                                                );
                                                            }
                                                            setTagBoxOpen(true);
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        const input =
                                                            tagInputRef.current;
                                                        if (input) {
                                                            const rect =
                                                                input.getBoundingClientRect();
                                                            setSuggestionStyle({
                                                                position:
                                                                    "fixed",
                                                                left: `${rect.left}px`,
                                                                top: `${rect.bottom + 8}px`,
                                                                width: `${rect.width}px`,
                                                                zIndex: 99999,
                                                            });
                                                        }
                                                        setTagBoxOpen(true);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            addChipTag(
                                                                tagQuery,
                                                            );
                                                        }
                                                        if (
                                                            e.key === "Escape"
                                                        ) {
                                                            setTagBoxOpen(
                                                                false,
                                                            );
                                                        }
                                                    }}
                                                    className="w-full outline-none text-sm"
                                                    placeholder="Add tags (e.g. Budget Trip)"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addChipTag(tagQuery)
                                                    }
                                                    className="text-xs font-semibold text-primary-700 hover:opacity-80"
                                                >
                                                    Add
                                                </button>
                                            </div>

                                            {/* Suggestions (always on top) */}
                                            {tagBoxOpen ? (
                                                <div
                                                    style={suggestionStyle}
                                                    className=" max-w-xs rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden max-h-40 z-[99999]"
                                                >
                                                    <div className="max-h-40 overflow-y-auto">
                                                        {filteredTagSuggestions.map(
                                                            (t) => (
                                                                <button
                                                                    key={t}
                                                                    type="button"
                                                                    onMouseDown={(
                                                                        e,
                                                                    ) =>
                                                                        e.preventDefault()
                                                                    }
                                                                    onClick={() =>
                                                                        addChipTag(
                                                                            t,
                                                                        )
                                                                    }
                                                                    className="w-full text-left px-2 py-2 hover:bg-neutral-50 text-xs"
                                                                >
                                                                    #{t}
                                                                </button>
                                                            ),
                                                        )}

                                                        {normalizeTagName(
                                                            tagQuery,
                                                        ) ? (
                                                            <button
                                                                type="button"
                                                                onMouseDown={(
                                                                    e,
                                                                ) =>
                                                                    e.preventDefault()
                                                                }
                                                                onClick={() =>
                                                                    addChipTag(
                                                                        tagQuery,
                                                                    )
                                                                }
                                                                className="w-full text-left px-3 py-2 hover:bg-neutral-50 text-xs font-medium text-primary-700 border-t border-neutral-100"
                                                            >
                                                                Create tag “#
                                                                {normalizeTagName(
                                                                    tagQuery,
                                                                )}
                                                                ”
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

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
                                            onClick={goToLocation}
                                        >
                                            <FiMapPin className="text-xl" />
                                        </IconButton>

                                        <IconButton
                                            label="Italic"
                                            onClick={() => exec("italic")}
                                            className={
                                                isItalic
                                                    ? "bg-neutral-900 text-white hover:bg-neutral-900"
                                                    : ""
                                            }
                                        >
                                            <FiItalic className="text-xl" />
                                        </IconButton>

                                        <IconButton
                                            label="Bold"
                                            onClick={() => exec("bold")}
                                            className={
                                                isBold
                                                    ? "bg-neutral-900 text-white hover:bg-neutral-900"
                                                    : ""
                                            }
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
                                        tag_names: chipTags,
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
