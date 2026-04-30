import { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FlashMessage from "@/Components/FlashMessage.jsx";

export default function ResetPassword({ token, email }) {
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePasswordConfirm, setHidePasswordConfirm] = useState(true);

  const { data, setData, post, processing, errors } = useForm({
    token: token || "",
    email: email || "",
    password: "",
    password_confirmation: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post("/reset-password");
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[520px]">
            <h1 className="text-center text-4xl font-bold tracking-tight text-zinc-900 lg:text-[36px]">
              Ubah Passwordmu
            </h1>

            <p className="mt-3 text-center text-base text-zinc-600 lg:text-[16px]">
              Pastikan minimal terdiri dari 15 karakter atau minimal 8 karakter
              yang termasuk angka dan huruf kecil.
            </p>

            <form onSubmit={submit} className="mt-10 space-y-5">
              {/* flash */}
              <FlashMessage className="mb-2" />

              {/* Email (biasanya hidden/readonly, tapi biar sesuai flow reset password) */}
              <input
                type="hidden"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
              />
              <input
                type="hidden"
                value={data.token}
                onChange={(e) => setData("token", e.target.value)}
              />

              {/* Password */}
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
                    placeholder="Password"
                    className="h-14 w-full rounded-xl border border-zinc-300 px-4 pr-12 text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                  />

                  <span
                    onClick={() => setHidePassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    {hidePassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                  </span>
                </div>

                {errors.password && (
                  <p className="mt-1 text-[16px] text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label
                  htmlFor="password_confirmation"
                  className="mb-2 block font-medium text-zinc-800 text-[16px]"
                >
                  Konfirmasi Password
                </label>

                <div className="relative">
                  <input
                    id="password_confirmation"
                    type={hidePasswordConfirm ? "password" : "text"}
                    value={data.password_confirmation}
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                    placeholder="Password"
                    className="h-14 w-full rounded-xl border border-zinc-300 px-4 pr-12 text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
                  />

                  <span
                    onClick={() => setHidePasswordConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    {hidePasswordConfirm ? (
                      <FaEyeSlash size={22} />
                    ) : (
                      <FaEye size={22} />
                    )}
                  </span>
                </div>

                {errors.password_confirmation && (
                  <p className="mt-1 text-[16px] text-red-500">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="h-14 w-full rounded-xl bg-[#0F80D8] text-[16px] font-semibold text-white hover:bg-[#0a6fbe] disabled:opacity-60"
              >
                {processing ? "Loading..." : "Ubah Password"}
              </button>

              {/* Back */}
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[16px] font-medium text-zinc-700 hover:text-zinc-900"
                >
                  <span className="text-xl leading-none">←</span>
                  Kembali Login
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sticky hidden lg:block max-h-screen top-0">
          <img
            src="/assets/auth/hero-reset-password.png"
            alt="Reset Password Hero"
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