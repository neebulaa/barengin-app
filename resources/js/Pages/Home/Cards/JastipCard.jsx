import React from "react";
import { GoHeart } from "react-icons/go";

export default function JastipCard({ product }) {
    const badgePos = product.tag?.includes("Buka") ? "right-2" : "left-2";

    return (
        <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="relative h-48 bg-neutral-100">
                <span
                    className={[
                        "absolute top-2",
                        badgePos,
                        product.tagColor,
                        "text-white text-[10px] px-2 py-1 rounded",
                    ].join(" ")}
                >
                    {product.tag}
                </span>

                <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover h-full w-full"
                />
            </div>

            <div className="p-4 text-neutral-700">
                <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                <p className="font-semibold mb-3">{product.price}</p>

                <div className="text-xs text-neutral-500 mb-3 flex items-center gap-1">
                    <i className="fa-solid fa-location-dot" /> Dari{" "}
                    {product.from} ke <strong>{product.to}</strong>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcepRNPYMHpVkXIrKDmVD5imvvt2XuLxrEpKXTwiDADfNWFqkUzNROcaF34ImdhJA4KR2k6j-dESkKAeUGJGUm3lGAAhVQQ6z3NRs-Wg&s=10"
                            className="w-6 h-6 rounded-full"
                            alt="User"
                        />
                        <span className="text-xs text-neutral-600 truncate">
                            Oleh {product.author}
                        </span>
                    </div>

                    <div className="text-xs font-semibold flex items-center gap-1">
                        <i className="fa-solid fa-star text-warning-600" />{" "}
                        <GoHeart /> {product.rating}
                    </div>
                </div>
            </div>
        </div>
    );
}
