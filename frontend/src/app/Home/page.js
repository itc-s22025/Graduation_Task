"use client";

import MainLayout from "@/components/MainLayout";
import s from "./page.module.css"
import PostButton from "@/components/post_button";
import withAuth from "@/components/withAuth";

const Home = () => {
    // ここに色々書き込む

    return(
        <>
            <MainLayout>
                <PostButton/>
            </MainLayout>
        </>
    )
}

export default withAuth(Home);