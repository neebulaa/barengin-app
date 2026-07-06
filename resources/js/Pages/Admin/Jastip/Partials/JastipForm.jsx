import React, { useState } from "react";
import Button from "@/Components/Button";
import Input from "@/Components/Input";
import { useTranslation } from "@/lib/useTranslation";
import { FiPlus, FiX, FiTrash2, FiInfo, FiImage } from "react-icons/fi";

const inputClass =
    "w-full rounded-xl border border-neutral-400 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary-700";
const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";
const cardTitle = "mb-4 text-lg font-semibold text-primary-700";
const card = "rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm";

export const emptyVariant = () => ({ name: "", options: [{ value: "", price: "" }] });

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

export default function JastipForm({
    data,
    setData,
    errors,
    processing,
    categories = [],
    existingImages = [],
    onRemoveExisting,
    onSaveDraft,
    onPublish,
}) {
    const { t } = useTranslation();
    const [previews, setPreviews] = useState([]);

    const err = (key) => errors?.[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>;
    const totalPrice = Number(data.base_price || 0) + Number(data.jastip_fee || 0);

    // ── Varian ──
    const updateVariant = (i, field, value) =>
        setData("variants", data.variants.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
    const addVariant = () => setData("variants", [...data.variants, emptyVariant()]);
    const removeVariant = (i) => setData("variants", data.variants.filter((_, idx) => idx !== i));
    const updateOption = (vi, oi, field, value) =>
        setData(
            "variants",
            data.variants.map((v, idx) =>
                idx === vi
                    ? { ...v, options: v.options.map((o, j) => (j === oi ? { ...o, [field]: value } : o)) }
                    : v,
            ),
        );
    const addOption = (vi) =>
        setData("variants", data.variants.map((v, idx) => (idx === vi ? { ...v, options: [...v.options, { value: "", price: "" }] } : v)));
    const removeOption = (vi, oi) =>
        setData("variants", data.variants.map((v, idx) => (idx === vi ? { ...v, options: v.options.filter((_, j) => j !== oi) } : v)));

    // ── Gambar ──
    const addImages = (fileList) => {
        const files = Array.from(fileList || []);
        if (!files.length) return;
        setData("images", [...(data.images || []), ...files]);
        setPreviews((prev) => [...prev, ...files.map((f) => ({ url: URL.createObjectURL(f), file: f }))]);
    };
    const removeNewImage = (idx) => {
        setData("images", data.images.filter((_, i) => i !== idx));
        setPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Informasi Umum */}
            <div className={card}>
                <h3 className={cardTitle}>{t("jastip.form.general")}</h3>
                <div className="mb-4">
                    <label className={labelClass}>{t("jastip.form.name")}</label>
                    <Input type="text" size="sm" value={data.name} onChange={(e) => setData("name", e.target.value)} placeholder={t("jastip.form.name_ph")} />
                    {err("name")}
                </div>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>{t("jastip.form.brand")}</label>
                        <Input type="text" size="sm" value={data.brand} onChange={(e) => setData("brand", e.target.value)} placeholder={t("jastip.form.brand_ph")} />
                        {err("brand")}
                    </div>
                    <div>
                        <label className={labelClass}>{t("jastip.form.category")}</label>
                        <select value={data.category} onChange={(e) => setData("category", e.target.value)} className={inputClass + " bg-white cursor-pointer"}>
                            <option value="">{t("jastip.form.category_ph")}</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{t(`jastip.category.${c.toLowerCase()}`, c)}</option>
                            ))}
                        </select>
                        {err("category")}
                    </div>
                </div>
                <div>
                    <label className={labelClass}>{t("jastip.form.description")}</label>
                    <textarea rows={4} value={data.description} onChange={(e) => setData("description", e.target.value)} placeholder={t("jastip.form.description_ph")} className={inputClass + " resize-none"} />
                    {err("description")}
                </div>
            </div>

            {/* Varian */}
            <div className={card}>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-primary-700">{t("jastip.form.variants")}</h3>
                    <Button type="button" size="xs" onClick={addVariant} className="gap-1.5">
                        {t("jastip.form.add_variant")} <FiPlus />
                    </Button>
                </div>

                <div className="space-y-5">
                    {data.variants.map((v, vi) => (
                        <div key={vi} className="rounded-2xl border border-neutral-200 p-4">
                            <div className="mb-3 flex items-end gap-2">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"><FiInfo size={15} /></span>
                                <div className="flex-1">
                                    <label className={labelClass}>{t("jastip.form.variant_name")}</label>
                                    <Input type="text" size="sm" value={v.name} onChange={(e) => updateVariant(vi, "name", e.target.value)} placeholder={t("jastip.form.variant_name_ph")} />
                                </div>
                                {data.variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(vi)} className="mb-0.5 rounded-lg bg-red-50 p-2.5 text-red-500 transition hover:bg-red-100">
                                        <FiTrash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="rounded-xl bg-neutral-50 p-3">
                                <div className="mb-1.5 grid grid-cols-2 gap-3 text-xs font-medium text-neutral-500">
                                    <span>{t("jastip.form.option")}</span>
                                    <span>{t("jastip.form.additional_price")}</span>
                                </div>
                                <div className="space-y-2">
                                    {v.options.map((o, oi) => (
                                        <div key={oi} className="flex items-center gap-2">
                                            <Input type="text" size="sm" className="flex-1" value={o.value} onChange={(e) => updateOption(vi, oi, "value", e.target.value)} placeholder={t("jastip.form.option_ph")} />
                                            <Input type="number" size="sm" min="0" className="flex-1" leftAddon="Rp" value={o.price} onChange={(e) => updateOption(vi, oi, "price", e.target.value)} placeholder="0" />
                                            {v.options.length > 1 && (
                                                <button type="button" onClick={() => removeOption(vi, oi)} className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100">
                                                    <FiX size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => addOption(vi)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-neutral-300 py-2 text-xs font-semibold text-primary-700 transition hover:bg-blue-50/40">
                                    <FiPlus /> {t("jastip.form.add_option")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Harga */}
            <div className={card}>
                <h3 className={cardTitle}>{t("jastip.form.price")}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>{t("jastip.form.base_price")}</label>
                        <Input type="number" size="sm" min="0" leftAddon="Rp" value={data.base_price} onChange={(e) => setData("base_price", e.target.value)} placeholder="0" />
                        {err("base_price")}
                    </div>
                    <div>
                        <label className={labelClass}>{t("jastip.form.jastip_fee")}</label>
                        <Input type="number" size="sm" min="0" leftAddon="Rp" value={data.jastip_fee} onChange={(e) => setData("jastip_fee", e.target.value)} placeholder="0" />
                        {err("jastip_fee")}
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50/60 px-4 py-3">
                    <span className="text-sm font-medium text-neutral-600">{t("jastip.form.total_price")}</span>
                    <span className="text-lg font-bold text-primary-700">{rupiah(totalPrice)}</span>
                </div>
                <p className="mt-2 text-xs text-neutral-400">{t("jastip.form.price_note")}</p>
            </div>

            {/* Inventaris & Estimasi waktu */}
            <div className={card}>
                <h3 className={cardTitle}>{t("jastip.form.inventory")}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className={labelClass}>{t("jastip.form.total_stock")}</label>
                        <Input type="number" size="sm" min="1" value={data.max_slot} onChange={(e) => setData("max_slot", e.target.value)} placeholder="0" />
                        {err("max_slot")}
                    </div>
                    <div>
                        <label className={labelClass}>{t("jastip.form.min_buy")}</label>
                        <Input type="number" size="sm" min="1" value={data.min_buy} onChange={(e) => setData("min_buy", e.target.value)} placeholder="1" />
                        {err("min_buy")}
                    </div>
                    <div>
                        <label className={labelClass}>{t("jastip.form.start_date")}</label>
                        <Input type="date" size="sm" value={data.start_date} onChange={(e) => setData("start_date", e.target.value)} />
                        {err("start_date")}
                    </div>
                    <div>
                        <label className={labelClass}>{t("jastip.form.end_date")}</label>
                        <Input type="date" size="sm" min={data.start_date || undefined} value={data.end_date} onChange={(e) => setData("end_date", e.target.value)} />
                        {err("end_date")}
                    </div>
                </div>
            </div>

            {/* Gambar Product */}
            <div className={card}>
                <h3 className={cardTitle}>{t("jastip.form.images")}</h3>
                <div className="flex flex-wrap gap-3">
                    <label className="flex h-32 w-32 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 text-neutral-400 transition hover:border-primary-700 hover:text-primary-700">
                        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} />
                        <FiImage size={24} className="mb-1" />
                        <span className="text-xs font-medium">{t("jastip.form.upload")}</span>
                    </label>

                    {/* Gambar lama (edit) */}
                    {existingImages.map((img) => (
                        <div key={`ex-${img.id}`} className="relative h-32 w-32 overflow-hidden rounded-xl border border-neutral-200">
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                            <button type="button" onClick={() => onRemoveExisting?.(img.id)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80">
                                <FiX size={13} />
                            </button>
                        </div>
                    ))}

                    {/* Gambar baru */}
                    {previews.map((p, idx) => (
                        <div key={`new-${idx}`} className="relative h-32 w-32 overflow-hidden rounded-xl border border-neutral-200">
                            <img src={p.url} alt="" className="h-full w-full object-cover" />
                            <button type="button" onClick={() => removeNewImage(idx)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80">
                                <FiX size={13} />
                            </button>
                        </div>
                    ))}
                </div>
                {err("images")}
            </div>

            {/* Aksi */}
            <div className="flex items-center gap-3 pb-2">
                <button
                    type="button"
                    disabled={processing}
                    onClick={onSaveDraft}
                    className="rounded-xl border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
                >
                    {t("jastip.form.save_draft")}
                </button>
                <Button type="primary" disabled={processing} onClick={onPublish} className="px-8 font-semibold">
                    {processing ? t("common.processing") : t("jastip.form.submit")}
                </Button>
            </div>
        </div>
    );
}
