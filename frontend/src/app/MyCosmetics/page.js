import MainLayout from "@/components/MainLayout";
import s from "./page.module.css"
import Header from "@/components/header";
import MyCosmeticItems from "@/components/myCosmeticItems";

const MyCosmetics = () => {
    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    {/*header*/}
                    <div className={s.headerContainer}>
                        <p className={s.headerText}>My Cosmetics</p>
                        <Header firstTabText={"カラコン"} secondTabText={"コスメ"} thirdTabText={"♥"} pageType="myCosmetics"/>
                    </div>

                    <div className={s.searchAndAddContainer}>
                        {/*search*/}
                        <div className={s.searchContainer}>
                            <img alt="虫眼鏡アイコン" src="虫眼鏡アイコン.png" className={s.searchImg}/>
                            <input type="search" className={s.searchBox} placeholder="search..."/>
                            <button type="button" className={s.searchButton}>Search</button>
                        </div>
                        <button type="button" className={s.addButton}>Add</button>
                    </div>

                    {/* MyCosmeticItems を searchAndAddContainer の下に配置 */}
                    <div className={s.itemsContainer}>
                        <MyCosmeticItems />
                        <MyCosmeticItems />
                        <MyCosmeticItems />
                        <MyCosmeticItems />
                    </div>
                </div>
            </MainLayout>
        </>
    )
}


export default MyCosmetics;