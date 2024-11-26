"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { collection, query, where, getDocs, Timestamp, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import home from "@/app/Home/page.module.css";
import MyCosmeticItems from "@/components/myCosmeticItems";
import MyCosmeticsHeaderTab from "@/components/myCosmeticsHeaderTab";

const MyCosmetics = () => {
    const [cosmeticsData, setCosmeticsData] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const [error, setError] = useState(null);
    const [tabs, setTabs] = useState([]);

    // tabsの初期値をセットする関数
    const initializeTabs = (fetchedTabs, cosmeticsData, favoriteItems) => {
        const initialTabs = [
            {
                name: 'all',
                title: 'ALL',
                content: (
                    <div className={s.itemsContainer}>
                        {cosmeticsData.map((cosmetic) => (
                            <MyCosmeticItems key={cosmetic.id} {...cosmetic} />
                        ))}
                    </div>
                ),
            },
            {
                name: 'favorites',
                title: '♥',
                content: (
                    <div className={s.itemsContainer}>
                        {favoriteItems.length > 0 ? (
                            favoriteItems.map((favoriteItem) => (
                                <MyCosmeticItems key={favoriteItem.id} {...favoriteItem} />
                            ))
                        ) : (
                            <p className={s.noFavs}>アイテムの左上にある♡をクリックするとお気に入りに登録できます</p>
                        )}
                    </div>
                ),
            },
        ];
        return [...initialTabs, ...fetchedTabs];
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    // Firebaseからリアルタイムにデータを取得
    useEffect(() => {
        if (!currentUserUid) return;

        const cosmeticsCollection = collection(db, "MyCosmetics");
        const cosmeticsQuery = query(
            cosmeticsCollection,
            where("user_id", "==", currentUserUid)
        );

        const unsubscribe = onSnapshot(cosmeticsQuery, (snapshot) => {
            const cosmeticsList = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    openDate: formatDateTime(data.openDate),
                    updatedDate: formatDateTime(data.updatedDate),
                };
            });
            setCosmeticsData(cosmeticsList);
        }, (err) => {
            setError("コスメデータの取得に失敗しました。");
            console.error(err);
        });

        return () => unsubscribe(); // コンポーネントのアンマウント時にリスナーを解除
    }, [currentUserUid]);


    // tabsの内容をFirebaseから取得して初期化
    useEffect(() => {
        if (!currentUserUid) return;

        const tabsCollection = collection(db, "tabs");
        const tabsQuery = query(tabsCollection, where("userId", "==", currentUserUid));

        const unsubscribe = onSnapshot(
            tabsQuery,
            (snapshot) => {
                const fetchedTabs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().tabName,
                    title: doc.data().tabTitle,
                    content: <div>{doc.data().tabTitle}のコンテンツをここに表示</div>, // 必要に応じて設定
                }));

                // favoriteItems をここで計算
                const favoriteItems = cosmeticsData.filter(item => item.isFavorite);

                setTabs(initializeTabs(fetchedTabs, cosmeticsData, favoriteItems));
            },
            (err) => {
                console.error("タブ情報の取得に失敗しました:", err);
            }
        );

        return () => unsubscribe();
    }, [currentUserUid, cosmeticsData]);

    // お気に入り登録関連
    const favoriteItems = cosmeticsData.filter(item => item.isFavorite);

    // addTab(+)の出現・キャンセル
    const [showAddTab, setShowAddTab] = useState(false);
    const handleAddClick = () => setShowAddTab(true);
    const handleCloseAddTab = () => setShowAddTab(false);

    // 新しいタブを追加する処理
    const [tabTitle, setTabTitle] = useState(""); // tabTitle 状態を追加
    const handleAddTabSubmit = async (tabTitle) => {
        if (!tabTitle) return; // タイトルが空の場合は処理しない

        if (tabs.length >= 3) {
            alert("タブは最大3つまでです");
            return;
        }

        const newTabName = `tab${tabs.length + 1}`;   // 新しいタブ名を自動生成
        const newTab = {
            name: newTabName,
            title: tabTitle,
            content: <div>新しいタブの内容</div>
        };

        // Firebaseにタブ情報を保存
        try {
            const tabsCollection = collection(db, "tabs"); // コレクション参照
            await addDoc(tabsCollection, {
                userId: currentUserUid, // 現在のユーザーIDを保存
                tabName: newTabName,
                tabTitle: tabTitle,
                createdAt: new Date(), // 作成日時を保存
            });

            // ローカル状態にもタブを追加
            setTabs([...tabs, newTab]);
            alert("新規タブを作成しました")
            setShowAddTab(false); // フォームを閉じる
            setTabTitle(""); // 入力フィールドをリセット
        } catch (error) {
            console.error("タブの登録中にエラーが発生しました:", error);
            alert("タブの登録に失敗しました。再試行してください。");
        }
    };

    // タブ削除機能
    const handleDeleteTab = async (tabId) => {
        // 必須タブの削除制限
        const nonDeletableTabs = ['all', 'favorites']; // 削除できないタブ名
        const targetTab = tabs.find(tab => tab.id === tabId);

        if (!targetTab || nonDeletableTabs.includes(targetTab.name)) {
            alert("このタブは削除できません。");
            return;
        }

        // 確認ダイアログを表示
        const isConfirmed = window.confirm(`「${targetTab.title}」タブを削除しますか？`);
        if (!isConfirmed) return;

        // Firebase から削除
        try {
            const tabDocRef = collection(db, "tabs");
            await deleteDoc(doc(tabDocRef, tabId));

            // ローカル状態からタブを削除
            setTabs(tabs.filter((tab) => tab.id !== tabId));
        } catch (error) {
            console.error("タブの削除に失敗しました:", error);
            alert("タブの削除に失敗しました。再試行してください。");
        }
    };



    //日付のフォーマット整えるやつ
    const formatDateTime = (date) => {
        if (!date) return "";
        const d = date instanceof Timestamp ? date.toDate() : new Date(date);
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}/${month}/${day}`;
    };

    return (
        <MainLayout>
            <div className={s.allContainer}>

                {/*ヘッダー*/}
                <div className={s.headerContainer}>
                    <p className={s.headerText}>My Cosmetics</p>

                    <MyCosmeticsHeaderTab
                        tabs={tabs}
                        handleAddTab={handleAddClick}
                        handleDeleteTab={handleDeleteTab}
                    />
                </div>

                {showAddTab && (
                    <div className={home.addTabOverlay}>
                        <div className={s.addTabContent}>
                            <div className={s.addTabContainer}>
                                <h2 className={s.addTabTitle}>新しいタブを追加する</h2>
                                <div className={s.addTabInputContainer}>
                                    <label className={s.inputTabLabel}>タブのタイトル：
                                        <input type="text" className={s.inputTabBox} placeholder="タブのタイトル" value={tabTitle} onChange={(e) => setTabTitle(e.target.value)} />
                                    </label>
                                </div>
                                <div className={s.tabButtonContainer}>
                                    <button type="button" onClick={handleCloseAddTab} className={s.addTabCancel}>キャンセル</button>
                                    <button type="button" className={s.addTabAdd} onClick={() => handleAddTabSubmit(tabTitle)}>追加</button>

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