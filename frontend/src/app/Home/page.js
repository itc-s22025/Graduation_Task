"use client";

import MainLayout from "@/components/MainLayout";
import PostButton from "@/components/post_button";
import withAuth from "@/components/withAuth";
import {useRouter} from "next/navigation";
import Header from "@/components/header";
import Post from "@/components/post";
import s from "@/app/Home/page.module.css"

const Home = () => {
    const router = useRouter();

    const homeAdditionalFeatures = (
        <button onClick={() => alert("Home専用機能")}>Homeボタン</button>
    );

    return(
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <Header firstTabText="Now" secondTabText="Following" thirdTabText="tab3" firstTabContent={<Post/>}
                            additionalFeatures={homeAdditionalFeatures} pageType="home"/>
                    <PostButton/>
                </div>
            </MainLayout>
        </>
    )
}

// export default withAuth(Home);
export default Home;