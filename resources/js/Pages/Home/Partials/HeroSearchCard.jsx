import React from "react";
import HeroTabs from "./HeroTabs";
import HeroTripForm from "./HeroTripForm";
import HeroPergiForm from "./HeroPergiForm";
import HeroJastipForm from "./HeroJastipForm";

export default function HeroSearchCard({ activeTab, setActiveTab }) {
    return (
        <div className="w-full bg-white rounded-2xl shadow-lg p-6">
            <HeroTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "trip" ? <HeroTripForm /> : null}
            {activeTab === "pergi" ? <HeroPergiForm /> : null}
            {activeTab === "jastip" ? <HeroJastipForm /> : null}
        </div>
    );
}
