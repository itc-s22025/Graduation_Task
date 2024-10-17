"use client";

import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import home from "@/app/Home/page.module.css"
import Header from "@/components/header";
import MyCosmeticItems from "@/components/myCosmeticItems";

const MyCosmetics = ({ pageType }) => {
    // state
    const [showAddTab, setShowAddTab] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // 状態管理用


    //Tab追加
    const handleAddClick = () => {
        setShowAddTab(true); // AddTabを表示
    };
    const handleCloseAddTab = () => {
        setShowAddTab(false); // AddTabを非表示
    };


    //新規コスメADD
    const handleAddButtonClick = () => {
        setIsAdding(!isAdding); // クリックで状態を切り替え
    };
    const handleCancelAdd = () => {
        setIsAdding(false); // AddTabを非表示
    };
    const handleAddNewCosmeClick = () => {
        alert("新規コスメ登録のAddボタンをクリックしました")
    }

    // const addTab = pageType === 'myCosmetics' ? home.addTabMC : home.addTabHome;


    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    {/* header */}
                    <div className={s.headerContainer}>
                        <p className={s.headerText}>My Cosmetics</p>
                        <Header firstTabText={"カラコン"} secondTabText={"コスメ"} thirdTabText={"♥"}
                                pageType="myCosmetics"/>
                        <button className={`${home.addButton}`} style={{ top: '63px' }} onClick={() => handleAddClick()}>+</button>
                    </div>

                    <div className={s.searchAndAddContainer}>
                    {/* search */}
                        <div className={s.searchContainer}>
                            <img alt="虫眼鏡アイコン" src="/虫眼鏡アイコン.png" className={s.searchImg}/>
                            <input type="search" className={s.searchBox} placeholder="search..."/>
                            <button type="button" className={s.searchButton}>Search</button>
                        </div>
                        <button type="button" className={s.addButton} onClick={handleAddButtonClick}>Add</button>
                    </div>

                    <div className={s.itemsContainer}>
                        <MyCosmeticItems/>
                        <MyCosmeticItems />
                         <MyCosmeticItems />
                         <MyCosmeticItems />
                    </div>



                    {/* タブ追加ボタン押したとき */}
                    {showAddTab && (
                        <div className={home.addTabOverlay}>
                            <div className={s.addTabContent}>
                                <div className={s.addTabContainer}>
                                    <h2 className={s.addTabTitle}>新しいタブを追加する</h2>
                                    <div className={s.addTabInputContainer}>
                                        <label className={s.inputTabLabel}>タブのタイトル：<input type="text" className={s.inputTabBox} placeholder="タブのタイトル"/></label>
                                    </div>
                                    <div className={s.tabButtonContainer}>
                                        <button type="button" onClick={handleCloseAddTab}
                                                className={s.addTabCancel}>キャンセル
                                        </button>
                                        <button type="button" className={s.addTabAdd}>追加</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add用のレイアウト */}
                    {isAdding && (
                        <>
                            <div className={home.addTabOverlay}>
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
