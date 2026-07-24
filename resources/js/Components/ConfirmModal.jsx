import { FiAlertCircle } from "react-icons/fi";
import Button from "@/Components/Button";
import Modal from "@/Components/Modal";

// Dialog konfirmasi standar (hapus/publish/verifikasi/dll) - dipakai konsisten
// di semua halaman admin. Layout: ikon kotak + judul/deskripsi rata kiri, dengan
// bar aksi di bawah. Shell overlay/portal/Esc ditangani oleh <Modal>.
export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Ya, Hapus",
    cancelLabel = "Batal",
    icon = <FiAlertCircle size={24} />,
    iconClass = "bg-red-100 text-red-500",
    confirmType = "danger", // primary | danger | success | warning | neutral
    processing = false,
}) {
    return (
        <Modal open={open} onClose={onClose} size="sm" className="overflow-hidden">
            <div className="p-6">
                {/* Header: ikon + judul/deskripsi (rata kiri) */}
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-neutral-700 mb-1">{title}</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
                    </div>
                </div>

                {/* Footer: bar aksi */}
                <div className="flex items-center justify-end gap-3 mt-6 bg-neutral-50 -mx-6 -mb-6 p-4 border-t border-neutral-100">
                    <Button
                        type="neutral"
                        variant="outline"
                        size="sm"
                        rounded={false}
                        onClick={onClose}
                        className="rounded-xl font-semibold"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type={confirmType}
                        size="sm"
                        rounded={false}
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-xl font-semibold shadow-sm disabled:opacity-60"
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
