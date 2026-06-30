import { useForm } from "@inertiajs/react";
import { FiChevronDown } from "react-icons/fi";
import Button from "@/Components/Button.jsx";
import Input from "@/Components/Input.jsx";
import Select from "@/Components/Select.jsx";
import MainLayout from "@/Layouts/MainLayout.jsx";

export default function Onboarding({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        full_name: user?.full_name || "",
        phone: "",
        gender: "",
        birth_date: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/onboarding");
    };

    const skip = (e) => {
        e.preventDefault();
        post("/onboarding/complete");
    };

    return (
        <div className="min-h-screen w-full bg-white">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                {/* LEFT */}
                <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
                    <div className="w-full max-w-[480px]">
                        <a href="/" className="block">
                            <img
                                src="/assets/barengin_logows.png"
                                alt="barengin logo"
                                className="h-12 mx-auto"
                            />
                        </a>

                        <h1 className="mt-4 text-center text-xl font-semibold tracking-tight text-neutral-700">
                            Mau dikenal orang lebih lagi?
                        </h1>

                        <p className="mt-1 pb-8 text-center text-sm text-neutral-600 border-b border-neutral-400">
                            Isi profilmu sekarang juga
                        </p>

                        <form onSubmit={submit} className="mt-8 space-y-4">
                            <Input
                                id="full_name"
                                type="text"
                                label="Nama Lengkap"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData("full_name", e.target.value)
                                }
                                placeholder="Masukan Nama Lengkap"
                                error={errors.full_name}
                                size="md"
                            />

                            <Input
                                id="phone"
                                type="text"
                                inputMode="numeric"
                                label="No HP"
                                leftAddon="+62"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                placeholder="810 0000 0000"
                                error={errors.phone}
                            />

                            <Select
                                id="gender"
                                label="Jenis Kelamin"
                                value={data.gender}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
                                }
                                error={errors.gender}
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </Select>

                            <Input
                                id="birth_date"
                                type="date"
                                label="Tanggal Lahir"
                                value={data.birth_date}
                                onChange={(e) =>
                                    setData("birth_date", e.target.value)
                                }
                                error={errors.birth_date}
                                size="md"
                                inputClassName="text-neutral-700"
                            />

                            <Button
                                type="primary"
                                variant="solid"
                                className="w-full mt-2"
                                disabled={processing}
                            >
                                {processing ? "Memproses..." : "Lanjut"}
                            </Button>

                            <Button
                                type="neutral"
                                variant="outline"
                                className="w-full"
                                onClick={skip}
                                disabled={processing}
                            >
                                Lewati
                            </Button>
                        </form>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="sticky hidden lg:block max-h-screen top-0">
                    <img
                        src="/assets/auth/hero-onboarding.png"
                        alt="Onboarding Hero"
                        className="h-screen w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/25 bottom-0" />

                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <h2 className="text-3xl font-semibold leading-tight xl:text-4xl max-w-[680px]">
                            Jalan Jalan sejenak, biar hati ikut pulang
                        </h2>
                        <p className="mt-4 max-w-[680px] text-base leading-relaxed text-white/95">
                            Rasakan serunya petualangan tanpa batas dengan
                            berbagai pilihan destinasi dan aktivitas, mulai dari
                            alam bebas hingga wisata kota yang penuh warna.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

Onboarding.layout = (page) => <MainLayout>{page}</MainLayout>;
