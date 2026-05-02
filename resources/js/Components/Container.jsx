import React from "react";

/**
 * Container
 * Centralized responsive page padding + max width.
 *
 * Default classes:
 * - container mx-auto
 * - py-2
 * - px-4 sm:px-6 lg:px-8
 *
 * Usage:
 * <Container>
 *   ...
 * </Container>
 *
 * Or override padding/spacing:
 * <Container className="py-6">
 *   ...
 * </Container>
 */
export default function Container({ as: Component = "div", className = "", children, ...props }) {
    return (
        <Component
            className={[
                "container mx-auto py-2 px-4 sm:px-6 lg:px-8",
                className,
            ].join(" ")}
            {...props}
        >
            {children}
        </Component>
    );
}