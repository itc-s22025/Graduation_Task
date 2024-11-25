"use client";

import MainLayout from "@/components/MainLayout";
import PostButton from "@/components/post_button";
import HeaderTab from "@/components/headerTab";
import Post from "@/components/post";
import ReviewPosts  from "@/components/ReviewPost";
import s from "@/app/Home/page.module.css"
import AddTab from "@/components/addTab";
import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "@/firebase";


const Home = ({ pageType }) => {
    const [showAddTab, setShowAddTab] = useState(false);
    const [following, setFollowing] = useState([]);
    const [user, setUser] = useState(null); // ユーザーの状態を保持

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser); // ユーザーが変更されたときにuserを更新
            } else {
                setUser(null); // ユーザーがログアウトした場合
            }
        });

        // コンポーネントがアンマウントされた時に監視を解除
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchFollowing = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setFollowing(userData.following || []);
                        console.log("userData.Following:::::", userData.following);
                    } else {
                        console.log("ユーザードキュメントが存在しません");
                    }
                } catch (error) {
                    console.error("users.followingの取得中にエラーが発生しました: ", error);
                }
            }
        };

        fetchFollowing();
    }, [user]); // userが変更されたときに実行

    const handleAddClick = () => {
        console.log("handleAddClick");
        setShowAddTab(true);
    };

    const handleCloseAddTab = () => {
        setShowAddTab(false);
    };

    const addTab = pageType === 'myCosmetics' ? s.addTabMC : s.addTabHome;

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
                </div>

                <PostButton />

                {showAddTab && (
                    <div className={s.addTabOverlay}>
                        <div className={s.addTabContent}>
                            <AddTab pageType={pageType} />
                            <button onClick={handleCloseAddTab} className={s.buttonCancel}>Cancel</button>
                        </div>
                    </div>
                )}
            </MainLayout>
        </>
    );
};

export default Home;
