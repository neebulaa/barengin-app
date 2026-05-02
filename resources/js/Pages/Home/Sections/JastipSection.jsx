import React from "react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import SectionHeading from "../Partials/SectionHeading";
import JastipCard from "../Cards/JastipCard";

export default function JastipSection({ products }) {
    return (
        <section className="py-12">
            <Container>
                <SectionHeading
                    label="Jasa Titip Terbaru"
                    align="right"
                    className="mb-8"
                />

                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-8">
                    <div>
                        <h2 className="text-3xl font-medium mb-2 text-neutral-700">
                            Belanja produk incaranmu
                        </h2>
                        <h2 className="text-3xl font-medium text-neutral-400">
                            diseluruh tempat
                        </h2>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-neutral-600 mb-4 max-w-sm ml-auto">
                            Titip barang impian dari mana pun dengan mudah,
                            aman, dan praktis langsung sampai ke tangan Anda.
                        </p>
                        <Button
                            type="primary"
                            className="px-6 py-2 rounded-full text-sm"
                        >
                            Eksplor Lebih Banyak
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <JastipCard key={p.id} product={p} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
