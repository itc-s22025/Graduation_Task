"use client";

import MainLayout from "@/components/MainLayout";
import Notifications from "@/components/Notifications";
import Message from "@/components/Message"

const Notification = () => {
    return (

        <>
            <MainLayout>
                <Notifications />
                <Message />
            </MainLayout>
        </>
    )
}

export default Notification