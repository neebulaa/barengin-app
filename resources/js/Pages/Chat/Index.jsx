import React from "react"
import MainLayout from "@/Layouts/MainLayout"
import NavbarAuth from "../../Components/NavbarAuth"
import Container from "../../Components/Container";

export default function ChatPersonalIndex(){
    return(
        <>
            <NavbarAuth />
            <Container>
                <div className="grid grid-cols-2 mt-3">
                    <div className="">
                        <div className="flex">
                            <h3 className="text-2xl font-bold text-grey-700 mb-5" >Chat Messages</h3>
                            
                        </div>
                    </div>
                    <div className="bg-red-100 ">
                        <h2>Profile Pic</h2>
                    </div>
                </div>
            </Container>
        </>
    );
}