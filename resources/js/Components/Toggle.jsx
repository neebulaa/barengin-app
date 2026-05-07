import React from "react";

/**
 * Toggle (switch) component.
 * - Uses a real checkbox input (sr-only) so clicking the label works.
 * - Symmetric knob movement for sm/md sizes.
 * - Optional label.
 */
export default function Toggle({
    id,
    name,
    checked = false,
    onChange = () => {},
    disabled = false,
    size = "md", // sm | md
    className = "",
    label,
    labelClassName = "",
    error,
    help,
    ...props
}) {
    const isSm = size === "sm";

    // Track + knob sizes
    const trackClass = isSm ? "w-9 h-5" : "w-11 h-6";
    const knobClass = isSm ? "w-3 h-3" : "w-4 h-4";

    // Knob positions (symmetric)
    // md track w-11 (44px), knob w-5 (20px), left padding ~2px => right translate ~20px => translate-x-5
    // sm track w-9 (36px), knob w-4 (16px), left padding ~2px => right translate ~16px => translate-x-4
    const knobTranslate = checked
        ? isSm
            ? "translate-x-4.5"
            : "translate-x-5.5"
        : "translate-x-0.5";

    return (
        <div className={className}>
            <div className={label ? "flex items-center gap-3" : "inline-flex"}>
                <label
                    className={[
                        "inline-flex items-center",
                        disabled
                            ? "opacity-70 cursor-not-allowed"
                            : "cursor-pointer",
                    ].join(" ")}
                >
                    {/* Real checkbox for accessibility + label click behavior */}
                    <input
                        id={id}
                        name={name}
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        disabled={disabled}
                        onChange={(e) => onChange(e.target.checked, e)}
                        {...props}
                    />

                    {/* Track */}
                    <span
                        aria-hidden="true"
                        className={[
                            "relative inline-flex items-center rounded-full transition-colors",
                            "focus-within:ring-2 focus-within:ring-primary-200 focus-within:ring-offset-2",
                            trackClass,
                            checked ? "bg-primary-700" : "bg-neutral-200",
                        ].join(" ")}
                    >
                        {/* Knob */}
                        <span
                            className={[
                                "absolute left-0.5 top-1/2 -translate-y-1/2",
                                "rounded-full bg-white shadow-sm transition-transform",
                                knobClass,
                                knobTranslate,
                            ].join(" ")}
                        />
                    </span>
                </label>

                {label ? (
                    <span
                        className={[
                            "text-sm text-neutral-700",
                            disabled
                                ? "opacity-70 cursor-not-allowed"
                                : "cursor-pointer",
                            labelClassName,
                        ].join(" ")}
                        onClick={() => !disabled && onChange(!checked)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (disabled) return;
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onChange(!checked);
                            }
                        }}
                    >
                        {label}
                    </span>
                ) : null}
            </div>

            {help ? (
                <p className="mt-1 text-xs text-neutral-500">{help}</p>
            ) : null}
            {error ? (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            ) : null}
        </div>
    );
}
