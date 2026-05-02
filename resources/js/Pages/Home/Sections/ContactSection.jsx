import React from "react";
import Container from "@/Components/Container";
import Button from "@/Components/Button";
import Input from "@/Components/Input";
import SectionHeading from "../Partials/SectionHeading";

export default function ContactSection() {
    return (
        <section className="py-16 border-t border-neutral-100 mt-8 mb-8">
            <Container>
                <SectionHeading
                    label="Hubungi Kami"
                    align="right"
                    className="mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-semibold mb-2 text-neutral-700">
                            Tuliskan saran{" "}
                            <span className="text-neutral-400">maupun</span>
                        </h2>
                        <h2 className="text-3xl font-semibold text-neutral-400 mb-6">
                            permintaan sekarang
                        </h2>
                        <p className="text-sm text-neutral-600 mb-8">
                            Ada pertanyaan atau saran buat liburanmu? Yuk,
                            hubungi kami di sini dan mari buat perjalananmu
                            lebih seru bareng-bareng!
                        </p>

                        <form
                            className="space-y-4"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <Input
                                label="Nama"
                                placeholder="Nama Lengkap Anda"
                            />
                            <Input
                                label="Email"
                                type="email"
                                placeholder="Kita akan kembali pada Anda disini"
                            />

                            <div>
                                <label className="mb-2 block text-sm text-neutral-700">
                                    Message
                                </label>
                                <textarea
                                    placeholder="Tuliskan bagaimana saran ataupun bantuan yang anda inginkan"
                                    rows={4}
                                    className={[
                                        "w-full px-4 py-2 text-sm",
                                        "border border-neutral-400 bg-white text-neutral-700 placeholder:text-neutral-500",
                                        "focus:border-primary-700 focus:outline-none",
                                        "rounded-xl resize-none",
                                    ].join(" ")}
                                />
                            </div>

                            <Button
                                type="primary"
                                className="w-fit px-12 py-3 mt-2 rounded-lg"
                            >
                                Kirim Pesan
                            </Button>
                        </form>
                    </div>

                    <div>
                        <img
                            src="/assets/hero-bg.jpg"
                            alt="Contact"
                            className="w-full h-64 object-cover rounded-2xl mb-8"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-2 text-neutral-700">
                                    Kunjungi kami sekarang
                                </h4>
                                <p className="text-sm text-neutral-600 flex items-start gap-2">
                                    <i className="fa-solid fa-location-dot mt-1 text-neutral-400" />
                                    Jl. Pakuan No.3, Sumur Batu, Kec. Babakan
                                    Madang, Kabupaten Bogor, Jawa Barat 16810,
                                    Indonesia
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2 text-neutral-700">
                                    Bicara kepada kami
                                </h4>
                                <p className="text-sm text-neutral-600 flex items-center gap-2 mb-2">
                                    <i className="fa-solid fa-phone text-neutral-400" />{" "}
                                    +628123123123
                                </p>
                                <p className="text-sm text-neutral-600 flex items-center gap-2">
                                    <i className="fa-solid fa-envelope text-neutral-400" />{" "}
                                    barenginapp@barengin.co.id
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
