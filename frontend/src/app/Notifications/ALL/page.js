"use client";

import MainLayout from "@/components/MainLayout";
import Notifications from "@/components/Notifications";
import Follow from "@/components/follow";
import Like from "../../../components/like"

const All = () => {
    return (

        <>
            <MainLayout>
                <Notifications />
                <Follow />
                <Like />
            </MainLayout>
        </>
    )
}

export default All