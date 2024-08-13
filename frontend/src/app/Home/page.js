import MainLayout from "@/components/MainLayout";
import s from "./page.module.css"
import PostButton from "@/components/post_button";
import Post from "@/components/post";

const Home = () => {
    // ここに色々書き込む

    return(
        <>
            <MainLayout>
                {/*<Post />*/}
                <PostButton/>
            </MainLayout>
        </>
    )
}

export default Home;