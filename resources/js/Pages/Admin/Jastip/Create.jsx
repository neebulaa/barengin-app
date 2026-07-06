import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import JastipForm, { emptyVariant } from "./Partials/JastipForm";
import { useTranslation } from "@/lib/useTranslation";
import { FiChevronLeft } from "react-icons/fi";

export default function Create({ categories = [] }) {
    const { t } = useTranslation();

    const form = useForm({
        name: "",
        brand: "",
        category: "",
        description: "",
        variants: [emptyVariant()],
        base_price: "",
        jastip_fee: "",
        max_slot: "",
        min_buy: "1",
        start_date: "",
        end_date: "",
        images: [],
        removed_images: [],
        publish: 0,
    });

    const submit = (publish) => {
        form.transform((d) => ({ ...d, publish: publish ? 1 : 0 }));
        form.post("/admin/jastip", { forceFormData: true });
    };

    return (
        <>
            <Head title="Tambah Jastip" />
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center gap-3">
                    <Link href="/admin/jastip" className="rounded-lg border border-neutral-200 p-2 text-neutral-500 transition hover:bg-neutral-50">
                        <FiChevronLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-700">{t("jastip.create_title")}</h1>
                        <p className="text-sm text-neutral-500">{t("jastip.create_subtitle")}</p>
                    </div>
                </div>
            </div>

            <JastipForm
                data={form.data}
                setData={form.setData}
                errors={form.errors}
                processing={form.processing}
                categories={categories}
                onSaveDraft={() => submit(false)}
                onPublish={() => submit(true)}
            />
        </>
    );
}

Create.layout = (page) => (
    <AdminLayout title="Manajemen Jastip">
        {page}
    </AdminLayout>
);
