import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { FiChevronLeft } from "react-icons/fi";
import TripForm, { emptyActivity } from "./Partials/TripForm";

export default function Create({ facilities = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        location: "",
        description: "",
        people_amount: "",
        start_date: "",
        end_date: "",
        price: "",
        image: null,
        facilities: [],
        activities: [emptyActivity()],
    });

    const submit = (e) => {
        e.preventDefault();
        post("/admin/trip", { forceFormData: true });
    };

    return (
        <>
            <Head title="Buat Perjalanan Baru" />
            <TripForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={submit}
                submitLabel="Simpan draft"
                facilities={facilities}
            />
        </>
    );
}

Create.layout = (page) => (
    <AdminLayout title="Dasbor - Home" subtitle="Selamat datang, Pemandu!">
        <div className="mb-6 flex items-center gap-3">
            <Link href="/admin/trip" className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition">
                <FiChevronLeft size={18} />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Buat Perjalanan Baru</h1>
                <p className="text-neutral-500 text-sm">Rencanakan perjalanan kolaboratifmu selanjutnya...</p>
            </div>
        </div>
        {page}
    </AdminLayout>
);
