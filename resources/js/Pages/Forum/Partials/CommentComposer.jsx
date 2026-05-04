import React, { useState } from "react";
import Textarea from "@/Components/Textarea";
import Button from "@/Components/Button";

export default function CommentComposer({
    placeholder = "Tulis komentar...",
    submitLabel = "Kirim",
    onSubmit,
    onCancel,
    compact = false,
}) {
    const [text, setText] = useState("");

    return (
        <div className={compact ? "" : "px-5 py-4 border-t border-neutral-200"}>
            <Textarea
                label={null}
                rows={compact ? 2 : 3}
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <div className="mt-2 flex items-center justify-end gap-2">
                {onCancel ? (
                    <Button
                        type="neutral"
                        variant="ghost"
                        rounded={true}
                        className="h-11 px-4"
                        onClick={() => {
                            setText("");
                            onCancel();
                        }}
                    >
                        Batal
                    </Button>
                ) : null}

                <Button
                    type="primary"
                    rounded={true}
                    className="h-11 px-6"
                    onClick={() => {
                        const v = text.trim();
                        if (!v) return;
                        onSubmit?.(v);
                        setText("");
                    }}
                >
                    {submitLabel}
                </Button>
            </div>
        </div>
    );
}
