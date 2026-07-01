import React from "react";
import Container from "@/Components/Container";
import SectionHeading from "../Partials/SectionHeading";
import { useTranslation } from "@/lib/useTranslation";

export default function AboutSection() {
    const { t } = useTranslation();
    return (
        <section className="py-12">
            <Container>
                <SectionHeading
                    label={t("home.about.label")}
                    align="right"
                    className="mb-8"
                />

                <h2 className="text-2xl md:text-3xl font-medium mb-8 leading-normal text-justify text-neutral-700">
                    {t("home.about.heading_1")}{" "}
                    <span className="text-neutral-500">
                        {t("home.about.heading_2")}
                    </span>
                </h2>

                <div className="relative rounded-2xl overflow-hidden h-[280px] md:h-[380px] mb-8">
                    <img
                        src="/assets/home/about-us.jpg"
                        alt="About"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 lg:mb-16 text-sm text-neutral-700">
                    <p>{t("home.about.p1")}</p>
                    <p>{t("home.about.p2")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <AboutStat value="90%" text={t("home.about.stat1")} />
                    <AboutStat value="100+" text={t("home.about.stat2")} />
                    <AboutStat value="4,9/5" text={t("home.about.stat3")} />
                </div>
            </Container>
        </section>
    );
}

function AboutStat({ value, text }) {
    return (
        <div>
            <h3 className="text-4xl lg:text-5xl mb-2 text-neutral-700">
                {value}
            </h3>
            <p className="text-sm text-neutral-700">{text}</p>
        </div>
    );
}
