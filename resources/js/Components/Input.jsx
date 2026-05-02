import React from "react";

export default function Input({
    label,
    error,
    size = "md", // sm | md
    rounded = true,
    className = "",
    inputClassName = "",
    wrapperClassName = "",

    leftIcon = null,
    rightIcon = null,

    leftAddon = null, // ReactNode (ex: "+62")
    rightAddon = null, // ReactNode (ex: eye toggle)

    ...props
}) {
    const heightClass = size === "sm" ? "h-11" : "h-12";
    const textClass = "text-sm";
    const roundedClass = rounded ? "rounded-xl" : "";

    const hasLeftIcon = Boolean(leftIcon);
    const hasRight = Boolean(rightIcon || rightAddon);

    // Icon is positioned at left-3 (~12px). With icon box w-5 (=20px),
    // input padding-left should be 12 + 20 + 8 = 40px => pl-10.
    const inputPadding = [
        "px-4",
        hasLeftIcon ? "pl-10" : "",
        hasRight ? "pr-12" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const baseInput =
        "w-full border border-neutral-400 bg-white text-neutral-700 placeholder:text-neutral-500 " +
        "focus:border-primary-700 focus:outline-none " +
        "disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70";

    const LeftIcon = () =>
        leftIcon ? (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                <div className="flex h-5 w-5 items-center justify-center">
                    {leftIcon}
                </div>
            </div>
        ) : null;

    const RightIcon = () =>
        rightIcon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                <div className="flex h-5 w-5 items-center justify-center">
                    {rightIcon}
                </div>
            </div>
        ) : null;

    const RightAddon = () =>
        rightAddon ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {rightAddon}
            </div>
        ) : null;

    // If leftAddon exists, render input-group container
    if (leftAddon) {
        return (
            <div className={wrapperClassName}>
                {label ? (
                    <label
                        htmlFor={props.id}
                        className="mb-2 block text-sm text-neutral-700"
                    >
                        {label}
                    </label>
                ) : null}

                <div
                    className={[
                        "flex w-full overflow-hidden border border-neutral-400 bg-white",
                        roundedClass,
                        "focus-within:border-primary-700",
                        heightClass,
                        className,
                    ].join(" ")}
                >
                    <div className="flex items-center justify-center border-r border-neutral-400 bg-neutral-50 px-4 text-sm font-medium text-neutral-700">
                        {leftAddon}
                    </div>

                    <div className="relative flex-1">
                        <LeftIcon />

                        <input
                            {...props}
                            className={[
                                "h-full w-full bg-transparent",
                                "text-sm text-neutral-700 placeholder:text-neutral-500",
                                "focus:outline-none",
                                hasLeftIcon ? "pl-10" : "px-4",
                                hasRight ? "pr-12" : "",
                                inputClassName,
                            ].join(" ")}
                        />

                        <RightIcon />
                        <RightAddon />
                    </div>
                </div>

                {error ? (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                ) : null}
            </div>
        );
    }

    // Normal input (no input-group)
    return (
        <div className={wrapperClassName}>
            {label ? (
                <label
                    htmlFor={props.id}
                    className="mb-2 block text-sm text-neutral-700"
                >
                    {label}
                </label>
            ) : null}

            <div className={["relative", className].join(" ")}>
                <LeftIcon />

                <input
                    {...props}
                    className={[
                        baseInput,
                        heightClass,
                        textClass,
                        roundedClass,
                        inputPadding,
                        inputClassName,
                    ].join(" ")}
                />

                <RightIcon />
                <RightAddon />
            </div>

            {error ? (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            ) : null}
        </div>
    );
}