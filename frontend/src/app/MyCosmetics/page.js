"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import home from "@/app/Home/page.module.css";
import MyCosmeticItems from "@/components/myCosmeticItems";
import MyCosmeticsHeaderTab from "@/components/myCosmeticsHeaderTab";

const MyCosmetics = () => {
    const [cosmeticsData, setCosmeticsData] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const [showAddTab, setShowAddTab] = useState(false);
    const [error, setError] = useState(null);

    const formatDateTime = (date) => {
        if (!date) return "";
        const d = date instanceof Timestamp ? date.toDate() : new Date(date);
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}/${month}/${day}`;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    const fetchCosmeticsData = async () => {
        if (!currentUserUid) return;

        try {
            const cosmeticsCollection = collection(db, "MyCosmetics");
            const cosmeticsQuery = query(
                cosmeticsCollection,
                where("user_id", "==", currentUserUid)
            );
            const cosmeticsSnapshot = await getDocs(cosmeticsQuery);
            const cosmeticsList = cosmeticsSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    openDate: formatDateTime(data.openDate),
                    updatedDate: formatDateTime(data.updatedDate),
                };
            });
            setCosmeticsData(cosmeticsList);
        } catch (err) {
            setError("コスメデータの取得に失敗しました。");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCosmeticsData();
    }, [currentUserUid]);

    const favoriteItems = cosmeticsData.filter(item => item.isFavorite);

    const handleAddClick = () => setShowAddTab(true);
    const handleCloseAddTab = () => setShowAddTab(false);

    return (
        <MainLayout>
            <div className={s.allContainer}>

                {/*ヘッダー*/}
                <div className={s.headerContainer}>
                    <p className={s.headerText}>My Cosmetics</p>

                    <MyCosmeticsHeaderTab
                       firstTabText="ALL"
                       secondTabText="♥"
                       firstTabContent={
                           <div className={s.itemsContainer}>
                               {cosmeticsData.map((cosmetic) => (
                                   <MyCosmeticItems
                                       key={cosmetic.id}
                                       {...cosmetic}
                                       fetchCosmeticsData={fetchCosmeticsData}
                                   />
                               ))}
                           </div>
                       }
                       secondTabContent={
                           <div className={s.itemsContainer}>
                               {favoriteItems.length > 0 ? (
                                   favoriteItems.map((favoriteItem) => (
                                       <MyCosmeticItems
                                           key={favoriteItem.id}
                                           {...favoriteItem}
                                           fetchCosmeticsData={fetchCosmeticsData}
                                       />
                                   ))
                               ) : (
                                   <p className={s.noFavs}>アイテムの左上にある♡をクリックするとお気に入りに登録できます</p>
                               )}
                           </div>
                       }
                    />
                    <button className={home.addButton} style={{ top: '68px' }} onClick={handleAddClick}>+</button>
                </div>

                {showAddTab && (
                    <div className={home.addTabOverlay}>
                        <div className={s.addTabContent}>
                            <div className={s.addTabContainer}>
                                <h2 className={s.addTabTitle}>新しいタブを追加する</h2>
                                <div className={s.addTabInputContainer}>
                                    <label className={s.inputTabLabel}>タブのタイトル：
                                        <input type="text" className={s.inputTabBox} placeholder="タブのタイトル"/>
                                    </label>
                                </div>
                                <div className={s.tabButtonContainer}>
                                    <button type="button" onClick={handleCloseAddTab} className={s.addTabCancel}>キャンセル</button>
                                    <button type="button" className={s.addTabAdd}>追加</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && <p>{error}</p>}
            </div>
        </MainLayout>
    );
}

export default MyCosmetics;