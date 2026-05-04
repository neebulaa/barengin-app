import React from "react";
import Button from "@/Components/Button";

export default function ComposerCard({ avatar }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <img
                        src={avatar}
                        alt="User avatar"
                        className="h-10 w-10 rounded-full object-cover"
                    />

                    <div className="flex-1 min-w-0">
                        {/* Plain input: no styling */}
                        <input
                            type="text"
                            placeholder="Apa yang baru?"
                            className="w-full bg-transparent outline-none"
                        />

                        {/* Mobile action */}
                        <div className="mt-4 sm:hidden">
                            <Button
                                type="neutral"
                                variant="outline"
                                rounded={true}
                                className="w-full h-12"
                            >
                                Post
                            </Button>
                        </div>
                    </div>

                    {/* Desktop action */}
                    <div className="hidden sm:block">
                        <Button
                            type="neutral"
                            variant="outline"
                            rounded={true}
                            className="px-10"
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>

            <div className="border-t border-neutral-200" />
        </div>
    );
}
