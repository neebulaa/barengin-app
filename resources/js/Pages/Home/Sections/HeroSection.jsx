import React, { useState } from "react";
import Container from "@/Components/Container";
import HeroSearchCard from "../Partials/HeroSearchCard";
import { useTranslation } from "@/lib/useTranslation";

export default function HeroSection() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("trip");

    return (
        <>
            {/* Hero */}
            <header
                className="pt-24 pb-30 md:pt-40 md:pb-40 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.4)), url('/assets/home/hero-bg.jpg')",
                }}
            >
                <Container className="text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-semibold mb-4">
                        {t("home.hero.title")}
                    </h1>
                    <p className="text-base md:text-lg mb-0 max-w-3xl mx-auto font-light">
                        {t("home.hero.subtitle")}
                    </p>
                </Container>
            </header>

            <section className="-mt-16 md:-mt-20">
                <Container>
                    <HeroSearchCard
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </Container>
            </section>
        </>
    );
}
