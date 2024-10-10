"use client";

import MainLayout from "@/components/MainLayout";
import PostButton from "@/components/post_button";
import withAuth from "@/components/withAuth";
import {useRouter} from "next/navigation";

const Home = () => {
    const router = useRouter();

    return(
        <>
            <MainLayout>
                <PostButton/>
            </MainLayout>
        </>
    )
}

// export default withAuth(Home);
export default Home;