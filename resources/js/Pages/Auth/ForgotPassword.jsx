import { Link, useForm } from "@inertiajs/react";
import FlashMessage from "@/Components/FlashMessage.jsx";

export default function ForgotPassword() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post("/forgot-password");
  };

  const resend = (e) => {
    e.preventDefault();
    post("/forgot-password/resend");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[520px]">
            <h1 className="text-center text-4xl font-bold tracking-tight text-zinc-900 lg:text-[36px]">
              Lupa Password?
            </h1>

            <p className="mt-3 text-center text-base text-zinc-600 lg:text-[16px]">
              Jangan khawatir, kami akan mengirimkanmu sebuah link untuk mereset
              passwordmu.
            </p>

            <form onSubmit={submit} className="mt-10 space-y-5">
              {/* flash */}
              <FlashMessage className="mb-2" />

              {/* email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="Masukan Email"
                  className="h-14 w-full rounded-xl border border-zinc-300 px-4 text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.email}</p>
                )}
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={processing}
                className="h-14 w-full rounded-xl bg-[#0F80D8] text-[16px] font-semibold text-white hover:bg-[#0a6fbe] disabled:opacity-60"
              >
                {processing ? "Loading..." : "Kirim link reset password"}
              </button>

              {/* bottom actions */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[16px] font-medium text-zinc-700 hover:text-zinc-900"
                >
                  <span className="text-xl leading-none">←</span>
                  Kembali Login
                </Link>

                <button
                  type="button"
                  onClick={resend}
                  disabled={processing}
                  className="text-[16px] font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
                >
                  Kirim Ulang
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sticky hidden lg:block max-h-screen top-0">
          <img
            src="/assets/auth/hero-forgot-password.png"
            alt="Forgot Password Hero"
            className="h-screen w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25 bottom-0" />

          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-3xl font-semibold leading-tight xl:text-4xl">
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