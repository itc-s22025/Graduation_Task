import MainLayout from "@/components/MainLayout";
import s from "./page.module.css"

const Home = () => {
    // ここに色々書き込む

    return(
        <>
            <MainLayout>
                <h1 className={s.all}>Home</h1>
            </MainLayout>
        </>
    )
}

export default Home;