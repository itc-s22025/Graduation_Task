"use client";

import MainLayout from "@/components/MainLayout";
import PostButton from "@/components/post_button";
import HeaderTab from "@/components/headerTab";
import s from "@/app/Home/page.module.css";
import { useState, useEffect } from "react";
import { auth } from "@/firebase";

const Home = () => {
    const [user, setUser] = useState(null);

    // ログインユーザーを監視
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser || null);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>

                    <HeaderTab
                        firstTabText="Now"
                        secondTabText="Following"
                        thirdTabText="tab3"
                        firstTabContent={
                        <>
                            <Post />
                            <ReviewPosts />
                        </>}
                        secondTabContent={<Post tabType={following} />}
                        pageType="home"
                    />

                    <button className={`${s.addButton} ${addTab}`} onClick={handleAddClick}>+</button>
                    {/* ユーザー情報を渡す */}
                    <HeaderTab user={user} />
                </div>

                <PostButton />
            </MainLayout>
        </>
    );
};

export default Home;
