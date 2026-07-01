import React from "react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import SectionHeading from "../Partials/SectionHeading";
import TripCard from "../Cards/TripCard";
import { useTranslation } from "@/lib/useTranslation";

export default function PopularTripsSection({ trips }) {
    const { t } = useTranslation();
    return (
        <section className="py-12 pt-4">
            <Container>
                <SectionHeading
                    label={t("home.popular.label")}
                    align="center"
                    className="mb-12"
                />

                <div className="flex flex-col text-center md:text-left md:flex-row justify-between items-center mb-10 gap-4 md:gap-7">
                    <div>
                        <h2 className="text-3xl font-medium leading-normal text-neutral-700">
                            {t("home.popular.heading_1")}
                        </h2>
                        <h2 className="text-3xl font-medium leading-normal text-neutral-500">
                            {t("home.popular.heading_2")}
                        </h2>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-sm text-neutral-700 mb-4 max-w-[400px] ml-auto">
                            {t("home.popular.subtitle")}
                        </p>
                        <Button
                            isButtonLink
                            href="/trip-bareng"
                            type="primary"
                            rounded={true}
                            className="px-6 py-2"
                        >
                            {t("common.explore_more")}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                    {trips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
