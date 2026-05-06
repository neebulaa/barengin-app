import React, {useState} from "react"
import MainLayout from "@/Layouts/MainLayout"
import NavbarAuth from "../../Components/NavbarAuth"
import Container from "../../Components/Container";
import InputField from "../../Components/Input"
import Button from "../../Components/Button"
import { BiSearch, BiFilter } from "react-icons/bi";
import { MdAdd } from "react-icons/md";

export default function ChatPersonalIndex(){
    const [tab, setTab] = useState('personal')
    const [filter, setFilter] = useState('all')

    return(
        <>
            <NavbarAuth />
            <Container className="grid grid-cols-2">
                <div className="mr-5 mt-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-2xl font-bold text-grey-700" >Chat Messages</h3>
                        <button
                            type="button"
                            className="inline-flex border h-10 w-10 items-center justify-center border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-100"
                        >
                            <MdAdd className="text-3xl"/>
                        </button>
                    </div>
                    
                    <div className="mt-6">
                        <div className="flex gap-2 w-full border border-neutral-300 rounded-full bg-white p-1">
                            <button
                                type="button"
                                onClick={() => setTab("personal")}
                                className={"flex-1 border rounded-full px-4 py-2 text-sm font-medium transition " + (tab == 'personal' ? "bg-primary-700 text-white":"bg-white text-primary-700")}
                            >
                                Pribadi
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab("group")}
                                className={"flex-1 border rounded-full px-4 py-2 text-sm font-medium transition " + (tab == 'group' ? "bg-primary-700 text-white":"bg-white text-primary-700")}
                            >
                                Grup Chat
                            </button>
                        </div>
                    </div>

                    <InputField 
                        placeholder="Search Chat..."
                        leftIcon={<BiSearch className="text-xl"/>}
                        className="mt-6"
                        size="md"
                    />

                    <div className="mt-6 flex justify-between gap-3">
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setFilter('all')}
                                className={"px-4 py-2 rounded-full text-sm font-medium transition " + (filter == 'all' ? "bg-primary-100 text-primary-700":"text-neutral-700 bg-neutral-100")}
                            >
                                Semua
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFilter('unread')}
                                className={"px-4 py-2 rounded-full text-sm font-medium transition " + (filter == 'unread' ? "bg-primary-100 text-primary-700":"text-neutral-700 bg-neutral-100")}
                            >
                                Belum Dibaca
                            </button>
                        </div>
                        <button
                            type="button"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100"
                            aria-label="Filter"
                        >
                            <BiFilter className="text-2xl text-neutral-700" />
                        </button>
                    </div>

                    <div className="mt-6">

                    </div>

                </div>
                <div className="bg-red-100 ">
                    <h2>Profile Pic</h2>
                </div>
                <div className="grid grid-cols-2 mt-3">
                </div>
            </Container>
        </>
    );
}