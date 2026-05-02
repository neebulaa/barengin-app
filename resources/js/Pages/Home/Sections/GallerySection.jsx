import React from "react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import SectionHeading from "../Partials/SectionHeading";
import GalleryItem from "../Cards/GalleryItem";

export default function GallerySection() {
    const src = "/assets/hero-bg.jpg";

    return (
        <section className="py-12 text-center border-t border-neutral-100 mt-8 pt-16">
            <Container>
                <SectionHeading
                    label="Gallery"
                    align="center"
                    className="mb-4"
                />

                <h2 className="text-3xl font-semibold mb-12 text-neutral-700">
                    Temukan Bentang Alam,{" "}
                    <span className="text-neutral-400">
                        Budaya, dan
                        <br /> Momen-Momen dalam Foto
                    </span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative">
                    <GalleryItem src={src} />
                    <GalleryItem src={src} />
                    <GalleryItem src={src} />
                    <GalleryItem src={src} />

                    <GalleryItem src={src} className="col-span-2" />
                    <GalleryItem src={src} />
                    <GalleryItem src={src} />

                    <Button
                        type="neutral"
                        variant="solid"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-6 py-2 text-sm shadow-lg"
                    >
                        Lihat Lebih Banyak
                    </Button>
                </div>

                <p className="text-sm text-neutral-500 max-w-2xl mx-auto">
                    Masuki dunia melalui galeri kurasi kami, yang mengabadikan
                    keindahan, budaya, dan momen tak terlupakan dari perjalanan
                    kami di seluruh negeri.
                </p>
            </Container>
        </section>
    );
}
