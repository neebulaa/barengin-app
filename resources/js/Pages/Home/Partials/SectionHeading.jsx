import React from "react";

/**
 * SectionHeading
 * - Renders a full-width horizontal line.
 * - Places the label on top of the line, aligned left/center/right.
 *
 * Props:
 * - label: string | ReactNode
 * - align: "left" | "center" | "right"
 * - lineClassName: customize the line (color/thickness)
 * - labelClassName: customize label styles
 */
export default function SectionHeading({
    label,
    align = "left",
    className = "",
    lineClassName = "",
    labelClassName = "",
}) {
    const justify =
        align === "center"
            ? "justify-center"
            : align === "right"
                ? "justify-end"
                : "justify-start";

    return (
        <div className={["relative w-full", className].join(" ")}>
            <div
                className={[
                    "absolute left-0 right-0 top-1/2 -translate-y-1/2",
                    "h-px bg-neutral-300",
                    lineClassName,
                ].join(" ")}
            />

            {/* label positioned over the line */}
            <div className={["relative flex w-full", justify].join(" ")}>
                <span
                    className={[
                        "bg-white px-3",
                        "text-sm font-semibold italic text-neutral-700",
                        labelClassName,
                    ].join(" ")}
                >
                    {label}
                </span>
            </div>
        </div>
    );
}
