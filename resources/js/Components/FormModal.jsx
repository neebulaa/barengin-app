import { FiAlertCircle } from "react-icons/fi";
import Button from "@/Components/Button";
import Modal from "@/Components/Modal";

// Varian ConfirmModal yang bisa memuat field input (children) di antara
// deskripsi dan bar aksi - dipakai mis. modal Re-trip (tanggal baru) dan
// modal Penawaran request jastip (harga + biaya). Shell overlay/portal/Esc
// ditangani oleh <Modal>; di sini panel dibuat kolom fleksibel supaya body-nya
// bisa di-scroll saat field-nya panjang tanpa melebihi tinggi layar.
export default function FormModal({
    open,
    onClose,
    onSubmit,
    title,
    description,
    children,
    confirmLabel = "Simpan",
    cancelLabel = "Batal",
    icon = <FiAlertCircle size={24} />,
    iconClass = "bg-blue-100 text-primary-700",
    confirmType = "primary", // primary | danger | success | warning | neutral
    processing = false,
    size = "sm", // sm | md | lg - lebar shell modal
}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            size={size}
            className="flex max-h-[90vh] flex-col overflow-hidden"
        >
            {/* Sengaja bukan <form>: komponen Button memakai prop `type` untuk
                warna sehingga tombol Batal ikut men-submit bila dibungkus form. */}
            {/* Header: ikon + judul/deskripsi (rata kiri) */}
            <div className="flex items-start gap-4 p-6 pb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-neutral-700 mb-1">{title}</h3>
                    {description && (
                        <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
                    )}
                </div>
            </div>

            {/* Field input - area yang bisa di-scroll */}
            {children && (
                <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-2">{children}</div>
            )}

            {/* Footer: bar aksi */}
            <div className="flex items-center justify-end gap-3 border-t border-neutral-100 bg-neutral-50 p-4">
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
                    onClick={onSubmit}
                    disabled={processing}
                    className="rounded-xl font-semibold shadow-sm disabled:opacity-60"
                >
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
