import { useForm } from "@inertiajs/react";
import { FiCalendar, FiChevronDown } from "react-icons/fi";

export default function Onboarding({user}) {
  const { data, setData, post, processing, errors } = useForm({
    full_name: user.full_name,
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
          <div className="w-full max-w-[520px]">
            <h1 className="text-center text-4xl font-bold tracking-tight text-zinc-900 lg:text-[36px]">
              Mau dikenal orang lebih lagi?
            </h1>

            <p className="mt-2 text-center text-base text-zinc-600 lg:text-[16px] pb-10 border-b border-b-gray-300">
              Isi profilmu sekarang juga
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  Nama Lengkap
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={data.full_name}
                  onChange={(e) => setData("full_name", e.target.value)}
                  placeholder="Masukan Nama Lengkap"
                  className="h-14 w-full rounded-xl border border-zinc-300 px-4 text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                />
                {errors.full_name && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.full_name}</p>
                )}
              </div>

              {/* No HP */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  No HP
                </label>

                <div className="flex h-14 w-full overflow-hidden rounded-xl border border-zinc-300">
                  <div className="flex w-24 items-center justify-center border-r border-zinc-300 bg-zinc-50 text-[16px] font-medium text-zinc-700">
                    +62
                  </div>
                  <input
                    id="phone"
                    type="text"
                    inputMode="numeric"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="810 0000 0000"
                    className="w-full px-4 text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  Jenis Kelamin
                </label>

                <div className="relative">
                  <select
                    id="gender"
                    value={data.gender}
                    onChange={(e) => setData("gender", e.target.value)}
                    className="h-14 w-full appearance-none rounded-xl border border-zinc-300 bg-white px-4 pr-10 text-[16px] text-zinc-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-zinc-500" />
                </div>

                {errors.gender && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.gender}</p>
                )}
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label
                  htmlFor="birth_date"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  Tanggal Lahir
                </label>

                <div className="relative">
                  <input
                    id="birth_date"
                    type="date"
                    value={data.birth_date}
                    onChange={(e) => setData("birth_date", e.target.value)}
                    className="date-input h-14 w-full rounded-xl border border-zinc-300 px-4 text-[16px] text-zinc-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {errors.birth_date && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.birth_date}</p>
                )}
              </div>

              {/* Buttons */}
              <button
                type="submit"
                disabled={processing}
                className="h-14 w-full rounded-xl bg-[#0F80D8] text-[16px] font-semibold text-white hover:bg-[#0a6fbe] disabled:opacity-60 mb-3"
              >
                {processing ? "Loading..." : "Lanjut"}
              </button>

              <button
                type="button"
                onClick={skip}
                className="h-14 w-full rounded-xl border border-zinc-300 bg-white text-[16px] font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Lewati
              </button>
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
            <h2 className="text-3xl font-semibold leading-tight xl:text-[40px] max-w-[680px]">
              Jalan Jalan sejenak, biar hati ikut pulang
            </h2>
            <p className="mt-4 max-w-[680px] text-base leading-relaxed text-white/95 xl:text-md">
              Rasakan serunya petualangan tanpa batas dengan berbagai pilihan
              destinasi dan aktivitas, mulai dari alam bebas hingga wisata kota
              yang penuh warna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}