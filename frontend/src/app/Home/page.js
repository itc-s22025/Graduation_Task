"use client";

import MainLayout from "@/components/MainLayout";
import PostButton from "@/components/post_button";
import withAuth from "@/components/withAuth";
import {useRouter} from "next/navigation";
import HeaderTab from "@/components/headerTab";
import Post from "@/components/post";
import s from "@/app/Home/page.module.css"
import AddTab from "@/components/addTab";
import {useState} from "react";
import EachPost from "@/components/eachPost";

const Home = ({pageType}) => {
    const router = useRouter();

    //state
    const [showAddTab, setShowAddTab] = useState(false);

    const handleAddClick = () => {
        console.log("handleAddClick");
        setShowAddTab(true); // AddTabを表示
    };

    const handleCloseAddTab = () => {
        setShowAddTab(false); // AddTabを非表示
    };

    const addTab = pageType === 'myCosmetics' ? s.addTabMC : s.addTabHome;

    return(
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <HeaderTab firstTabText="Now" secondTabText="Following" thirdTabText="tab3" firstTabContent={<Post/>}
                               pageType="home"/>
                    <button className={`${s.addButton} ${addTab}`} onClick={handleAddClick}>+</button>
                </div>

                <PostButton/>


                {/* タブ追加ボタン押したとき */}
                {showAddTab && (
                    <div className={s.addTabOverlay}>
                        <div className={s.addTabContent}>
                            <AddTab pageType={pageType} /> {/* pageTypeを渡す */}
                            <button onClick={handleCloseAddTab} className={s.buttonCancel}>Cancel</button>
                        </div>
                    </div>
                )}

            </MainLayout>
        </>
    )
}

// export default withAuth(Home);
export default Home;