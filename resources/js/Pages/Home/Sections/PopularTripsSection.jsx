import React from "react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import SectionHeading from "../Partials/SectionHeading";
import TripCard from "../Cards/TripCard";

export default function PopularTripsSection({ trips }) {
    return (
        <section className="py-12">
            <Container>
                <SectionHeading
                    label="Trip Popular"
                    align="center"
                    className="mb-8"
                />

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-8">
                    <div>
                        <h2 className="text-3xl font-medium mb-2 text-neutral-700">
                            Perjalanan Melalui
                        </h2>
                        <h2 className="text-3xl font-medium text-neutral-500">
                            Destinasi Terbaik di Dunia
                        </h2>
                    </div>

                    <div className="text-right">
                        <p className="text-base text-neutral-600 mb-4 max-w-[470px] ml-auto">
                            Jelajahi kota kosmopolitan dengan perpaduan budaya
                            dan kehidupan modern yang dinamis.
                        </p>
                        <Button
                            type="primary"
                            rounded={true}
                            className="px-6 py-2"
                        >
                            Eksplor Lebih Banyak
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {trips.map((trip) => (
                        <TripCard key={trip.id} trip={trip} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
