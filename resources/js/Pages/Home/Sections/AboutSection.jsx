import React from "react";
import Container from "@/Components/Container";
import SectionHeading from "../Partials/SectionHeading";

export default function AboutSection() {
    return (
        <section className="py-12">
            <Container>
                <SectionHeading
                    label="Tentang Kami"
                    align="right"
                    className="mb-8"
                />

                <h2 className="text-2xl md:text-3xl font-medium mb-8 leading-tight text-justify text-neutral-700">
                    Kami merancang perjalanan di seluruh dunia{" "}
                    <span className="text-neutral-500">
                        dengan memadukan destinasi ikonik dan hidden gems untuk
                        menghadirkan pengalaman yang autentik dan berkesan.
                    </span>
                </h2>

                <div className="relative rounded-2xl overflow-hidden h-[380px] mb-8">
                    <img
                        src="/assets/home/about-us.jpg"
                        alt="About"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 lg:mb-16 text-sm text-neutral-600">
                    <p>
                        Tim kami terdiri dari para pecinta tempat, ahli lokal,
                        dan spesialis perjalanan yang berdedikasi untuk
                        menciptakan pengalaman yang unik dan bermakna.
                    </p>
                    <p>
                        Dari kota yang dinamis hingga alam dan pantai yang
                        menenangkan, kami sajikan pengalaman terbaik di setiap
                        perjalanan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <AboutStat
                        value="90%"
                        text="Wisatawan akan merekomendasikan kami kepada teman dan keluarga."
                    />
                    <AboutStat
                        value="100+"
                        text="Rencana perjalanan unik dibuat untuk menampilkan keindahan Indonesia."
                    />
                    <AboutStat
                        value="4,9/5"
                        text="Rating rata-rata 4,9/5 dari ratusan pelanggan yang puas."
                    />
                </div>
            </Container>
        </section>
    );
}

function AboutStat({ value, text }) {
    return (
        <div>
            <h3 className="text-4xl lg:text-5xl mb-2 text-neutral-600">
                {value}
            </h3>
            <p className="text-sm text-neutral-600">{text}</p>
        </div>
    );
}
