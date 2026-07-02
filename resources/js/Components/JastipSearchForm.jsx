import React from "react";
import Input from "@/Components/Input";
import Select from "@/Components/Select";
import Button from "@/Components/Button";
import { useTranslation } from "@/lib/useTranslation";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

export default function JastipSearchForm({ naked = false }) {
    const { t } = useTranslation();
    return (
        <div className={`w-full ${naked ? "bg-white rounded-2xl shadow-lg p-6" : ""}`}>
            <div className="grid grid-cols-1 md:grid-cols-13 gap-4 items-end animate-fade-in">
                <div className="md:col-span-5">
                    <Input
                        label={t("search.jastip_from")}
                        placeholder="Jln Sentul, Bogor Selatan"
                        leftIcon={<FaMapMarkerAlt />}
                    />
                </div>

                <div className="md:col-span-3">
                    <Select label={t("search.jastip_category")} defaultValue="">
                        <option value="">{t("search.cat_food")}</option>
                        <option value="fashion">{t("search.cat_fashion")}</option>
                        <option value="elektronik">{t("search.cat_electronic")}</option>
                    </Select>
                </div>

                <div className="md:col-span-3">
                    <Select label={t("search.status")} defaultValue="ongoing">
                        <option value="ongoing">{t("search.status_ongoing")}</option>
                        <option value="outgoing">{t("search.status_closed")}</option>
                        <option value="upcoming">{t("search.status_upcoming")}</option>
                    </Select>
                </div>

                <div className="md:col-span-2">
                    <Button
                        type="primary"
                        rounded={true}
                        className="w-full h-12 flex items-center justify-center gap-2"
                    >
                        <FaSearch />
                        {t("search.cari")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
