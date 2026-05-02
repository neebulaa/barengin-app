import React from "react";

export default function GalleryItem({ src, className = "" }) {
    return (
        <img
            src={src}
            className={["rounded-xl w-full h-48 object-cover", className].join(
                " ",
            )}
            alt="Gallery"
        />
    );
}
