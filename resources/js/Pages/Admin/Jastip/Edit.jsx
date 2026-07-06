import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import JastipForm, { emptyVariant } from "./Partials/JastipForm";
import { useTranslation } from "@/lib/useTranslation";
import { FiChevronLeft } from "react-icons/fi";

export default function Edit({ item, categories = [] }) {
    const { t } = useTranslation();
    const [existingImages, setExistingImages] = useState(item.existing_images || []);

    const form = useForm({
        name: item.name || "",
        brand: item.brand || "",
        category: item.category || "",
        description: item.description || "",
        variants: item.variants?.length
            ? item.variants.map((v) => ({
                name: v.name || "",
                options: v.options?.length ? v.options.map((o) => ({ value: o.value || "", price: o.price ?? "" })) : [{ value: "", price: "" }],
            }))
            : [emptyVariant()],
        base_price: item.base_price ?? "",
        jastip_fee: item.jastip_fee ?? "",
        max_slot: item.max_slot ?? "",
        min_buy: item.min_buy ?? "1",
        start_date: item.start_date || "",
        end_date: item.end_date || "",
        images: [],
        removed_images: [],
        publish: item.status === "published" ? 1 : 0,
    });

    const removeExisting = (id) => {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));
        form.setData("removed_images", [...form.data.removed_images, id]);
    };

    const submit = (publish) => {
        form.transform((d) => ({ ...d, publish: publish ? 1 : 0 }));
        form.post(`/admin/jastip/${item.id}`, { forceFormData: true });
    };

    return (
        <>
            <Head title="Edit Jastip" />
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center gap-3">
                    <Link href="/admin/jastip" className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition hover:bg-neutral-50">
                        <FiChevronLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-700">{t("jastip.edit_title")}</h1>
                        <p className="text-sm text-neutral-500">{t("jastip.edit_subtitle")}</p>
                    </div>
                </div>
            </div>

            <JastipForm
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                categories={categories}
                existingImages={existingImages}
                onRemoveExisting={removeExisting}
                onSaveDraft={() => submit(false)}
                onPublish={() => submit(true)}
            />
        </>
    );
}

Edit.layout = (page) => (
    <AdminLayout title="Manajemen Jastip">
        {page}
    </AdminLayout>
);
