import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlashMessage from "@/Components/FlashMessage.jsx"

export default function Login() {
  const [hidePassword, setHidePassword] = useState(true);

  const { data, setData, post, processing, errors } = useForm({
    login: "",
    password: "",
    remember: true,
  });

  const submit = (e) => {
    e.preventDefault();
    post("/login");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[520px]">
            <h1 className="text-center text-4xl font-bold tracking-tight text-zinc-900 lg:text-[36px]">
              Selamat Datang
            </h1>

            <p className="mt-2 text-center text-base text-zinc-600 lg:text-[16px] pb-10 border-b border-b-gray-300">
              Login akun anda dan jelajahi hiburan di dunia
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              {/* login */}
              <div>
                <FlashMessage className="mb-2"/>
                <label
                  htmlFor="login"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  Username or Email
                </label>
                <input
                  id="login"
                  type="text"
                  value={data.login}
                  onChange={(e) => setData("login", e.target.value)}
                  placeholder="Masukan Username atau Email"
                  className="h-14 w-full rounded-xl border border-zinc-300 px-4 text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                />
                {errors.login && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.login}</p>
                )}
              </div>

              {/* password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={hidePassword ? "password" : "text"}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Masukan Password"
                    className="h-14 w-full rounded-xl border border-zinc-300 px-4 pr-12 text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                  />

                  <span
                    onClick={() => setHidePassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    {hidePassword ? (
                      <FaEyeSlash size={22} />
                    ) : (
                      <FaEye size={22} />
                    )}
                  </span>
                </div>

                {errors.password && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.password}</p>
                )}
              </div>

              {/* remember + forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-[16px] text-zinc-700">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData("remember", e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ingat saya 30 hari kedepan
                </label>

                <Link
                  href="/forgot-password"
                  className="text-[16px] font-semibold text-blue-600 underline hover:text-blue-700"
                >
                  Lupa Password
                </Link>
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={processing}
                className="h-14 w-full rounded-xl bg-[#0F80D8] text-[16px] font-semibold text-white hover:bg-[#0a6fbe] disabled:opacity-60 mb-3"
              >
                {processing ? "Loading..." : "Sign In"}
              </button>

              {/* google */}
              <button
                type="button"
                onClick={() => (window.location.href = "/auth/google/redirect")}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-zinc-300 bg-white text-[16px] font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <img
                  src="/assets/icons/google.png"
                  alt="Google"
                  className="h-5 w-5"
                />
                Sign In with Google
              </button>

              <p className="pt-2 text-center text-[16px] text-zinc-700">
                Belum mempunyai akun?{" "}
                <Link href="/sign-up" className="font-semibold underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sticky hidden lg:block max-h-screen top-0">
          <img
            src="/assets/auth/hero-login.png"
            alt="Mountain"
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