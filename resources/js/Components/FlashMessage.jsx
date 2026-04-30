import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { FiX } from "react-icons/fi";

export default function FlashMessageInline({ className = "" }) {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(true);

  const message = flash?.message;
  const type = (flash?.type || "info").toLowerCase();

  useEffect(() => {
    setVisible(true);
  }, [message, type]);

  if (!message || !visible) return null;

  const tone = (() => {
    // default: error style seperti di gambar
    if (type === "success")
      return {
        wrap: "border-emerald-300 bg-emerald-50 text-emerald-700",
        divider: "bg-emerald-300",
        btn: "text-emerald-700 hover:bg-emerald-100",
      };

    if (type === "warning")
      return {
        wrap: "border-amber-300 bg-amber-50 text-amber-700",
        divider: "bg-amber-300",
        btn: "text-amber-700 hover:bg-amber-100",
      };

    if (type === "info")
      return {
        wrap: "border-sky-300 bg-sky-50 text-sky-700",
        divider: "bg-sky-300",
        btn: "text-sky-700 hover:bg-sky-100",
      };

    // error
    return {
      wrap: "border-rose-300 bg-rose-50 text-rose-700",
      divider: "bg-rose-300",
      btn: "text-rose-700 hover:bg-rose-100",
    };
  })();

  return (
    <div className={["w-full", className].join(" ")}>
      <div
        className={[
          "mx-auto flex w-full items-center justify-between gap-3",
          "rounded-xl border px-5 py-4",
          "text-[16px] font-medium",
          tone.wrap,
        ].join(" ")}
        role="alert"
        aria-live="polite"
      >
        <p className="min-w-0 flex-1 truncate sm:whitespace-normal">
          {message}
        </p>

        <div className={["h-6 w-px", tone.divider].join(" ")} />

        <button
          type="button"
          onClick={() => setVisible(false)}
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-lg transition",
            tone.btn,
          ].join(" ")}
          aria-label="Close"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}