"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import overlay from "@/styles/header.module.css"
import Header from "@/components/header";
import MyCosmeticItems from "@/components/myCosmeticItems";

const MyCosmetics = () => {
    const [isAdding, setIsAdding] = useState(false); // 状態管理用

    const handleAddButtonClick = () => {
        setIsAdding(!isAdding); // クリックで状態を切り替え
    };

    const handleCancelAdd = () => {
        setIsAdding(false); // AddTabを非表示
    };

    const handleAddNewCosmeClick = () => {
        alert("新規コスメ登録のAddボタンをクリックしました")
    }

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    {/* header */}
                    <div className={s.headerContainer}>
                        <p className={s.headerText}>My Cosmetics</p>
                        <Header firstTabText={"カラコン"} secondTabText={"コスメ"} thirdTabText={"♥"} pageType="myCosmetics" />
                    </div>

                    <div className={s.searchAndAddContainer}>
                        {/* search */}
                        <div className={s.searchContainer}>
                            <img alt="虫眼鏡アイコン" src="虫眼鏡アイコン.png" className={s.searchImg} />
                            <input type="search" className={s.searchBox} placeholder="search..." />
                            <button type="button" className={s.searchButton}>Search</button>
                        </div>
                        <button type="button" className={s.addButton} onClick={handleAddButtonClick}>Add</button>
                    </div>

                    <div className={s.itemsContainer}>
                        <MyCosmeticItems />
                        <MyCosmeticItems />
                         <MyCosmeticItems />
                         {/*<MyCosmeticItems />*/}
                    </div>


                    {/* Add用のレイアウト */}
                    {isAdding && (
                        <>
                            <div className={overlay.addTabOverlay}>
                                <div className={s.addTabContent}>
                                    <h2 className={s.newCosmeticTitle}>新しいコスメを追加</h2>
                                    <form>
                                        <div className={s.inputContainer}>
                                            <input type="date" className={s.inputBox} placeholder="開封日" />
                                            <input type="text" className={s.inputBox} placeholder="ブランド" />
                                            <input type="text" className={s.inputBox} placeholder="商品名" />
                                            <div>
                                                <label className={s.inputLabel}><input type="number" className={s.inputBoxMini} placeholder="個数" />個</label>
                                            </div>
                                            <div>
                                                <label className={s.inputLabel}><input type="number" className={s.inputBoxMini} placeholder="1個あたりの価格" />円</label>
                                            </div>
                                            <textarea className={s.inputMemo} placeholder="メモ" />
                                        </div>
                                        <div className={s.inputButtonContainer}>
                                            <button className={s.inputCancel} onClick={handleCancelAdd}>キャンセル</button>
                                            <button className={s.inputAdd} type="button" onClick={() => { setIsAdding(false); handleAddNewCosmeClick() }}>追加</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </MainLayout>
        </>
    );
};

export default MyCosmetics;
