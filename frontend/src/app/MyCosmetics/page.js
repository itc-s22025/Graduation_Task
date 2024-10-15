import MainLayout from "@/components/MainLayout";
import s from "./page.module.css"
import Header from "@/components/header";

const MyCosmetics = () => {

    return(
        <>
            <MainLayout>
                <div className={s.headerContainer}>
                    <p className={s.headerText}>My Cosmetics</p>
                    <Header firstTabText={"カラコン"} secondTabText={"コスメ"} thirdTabText={"♥"} firstTabContent={"aaa"}
                    pageType="myCosmetics"/>
                </div>
            </MainLayout>
        </>
    )
}

export default MyCosmetics;