"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import home from "@/app/Home/page.module.css";
import HeaderTab from "@/components/headerTab";
import MyCosmeticItems from "@/components/myCosmeticItems";

const MyCosmetics = ({ pageType }) => {
    const [cosmeticsData, setCosmeticsData] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const [showAddTab, setShowAddTab] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        openDate: '',
        brand: '',
        productName: '',
        quantity: '',
        pricePerUnit: '',
        memo: ''
    });

    // 現在のユーザ情報を取得
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUserUid(user.uid);
            } else {
                setCurrentUserUid(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // データを取得する関数
    const fetchCosmeticsData = async () => {
        if (!currentUserUid) return;

        const cosmeticsCollection = collection(db, "MyCosmetics");
        const cosmeticsQuery = query(
            cosmeticsCollection,
            where("user_id", "==", currentUserUid)
        );
        const cosmeticsSnapshot = await getDocs(cosmeticsQuery);
        const cosmeticsList = cosmeticsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setCosmeticsData(cosmeticsList);
    };

    useEffect(() => {
        fetchCosmeticsData();
    }, [currentUserUid]);

    // 新しいコスメを追加
    const handleAddNewCosmeClick = async () => {
        try {
            await addDoc(collection(db, "MyCosmetics"), {
                ...formData,
                user_id: currentUserUid, // user_idとして現在のユーザーUIDを保存
            });
            alert("新しいコスメが登録されました");
            await fetchCosmeticsData(); // データを再取得
            setFormData({
                openDate: '',
                brand: '',
                productName: '',
                quantity: '',
                pricePerUnit: '',
                memo: ''
            });
            setIsAdding(false); // フォームを非表示に
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("コスメの登録中にエラーが発生しました");
        }
    };

    // フォーム入力の変更を管理
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddClick = () => {
        setShowAddTab(true);
    };
    const handleCloseAddTab = () => {
        setShowAddTab(false);
    };

    const handleAddButtonClick = () => {
        setIsAdding(!isAdding);
    };
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    // 開封日用のDateInputコンポーネント
    const DateInput = () => {
        const [inputType, setInputType] = useState('text');
        return (
            <input
                type={inputType}
                name="openDate"
                placeholder="開封日"
                onFocus={() => setInputType('date')}
                onBlur={() => setInputType('text')}
                className={s.inputBox}
                value={formData.openDate}
                onChange={handleInputChange}
            />
        );
    };

    return (
        <MainLayout>
            <div className={s.allContainer}>
                <div className={s.headerContainer}>
                    <p className={s.headerText}>My Cosmetics</p>
                    <HeaderTab firstTabText={"カラコン"} secondTabText={"コスメ"} thirdTabText={"♥"} pageType="myCosmetics"/>
                    <button className={`${home.addButton}`} style={{ top: '63px' }} onClick={handleAddClick}>+</button>
                </div>

                <div className={s.searchAndAddContainer}>
                        <div className={s.searchContainer}>
                            <img alt="search_black" src="/search_black.png" className={s.searchImg}/>
                            <input type="search" className={s.searchBox} placeholder="search..."/>
                            <button type="button" className={s.searchButton}>Search</button>
                        </div>
                        <button type="button" className={s.addButton} onClick={handleAddButtonClick}>Add</button>
                    </div>

                <div className={s.itemsContainer}>
                    {cosmeticsData.map((cosmetic) => (
                        <MyCosmeticItems
                            key={cosmetic.id}
                            openDate={cosmetic.openDate}
                            brand={cosmetic.brand}
                            productName={cosmetic.productName}
                            quantity={cosmetic.quantity}
                            price={cosmetic.pricePerUnit}
                            memo={cosmetic.memo}
                        />
                    ))}
                </div>

                {showAddTab && (
                        <div className={home.addTabOverlay}>
                            <div className={s.addTabContent}>
                                <div className={s.addTabContainer}>
                                    <h2 className={s.addTabTitle}>新しいタブを追加する</h2>
                                    <div className={s.addTabInputContainer}>
                                        <label className={s.inputTabLabel}>タブのタイトル：<input type="text" className={s.inputTabBox} placeholder="タブのタイトル"/></label>
                                    </div>
                                    <div className={s.tabButtonContainer}>
                                        <button type="button" onClick={handleCloseAddTab} className={s.addTabCancel}>キャンセル</button>
                                        <button type="button" className={s.addTabAdd}>追加</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* 新規コスメ追加用フォーム */}
                {isAdding && (
                    <div className={home.addTabOverlay}>
                        <div className={s.addTabContent}>
                            <h2 className={s.newCosmeticTitle}>新しいコスメを追加</h2>
                            <form>
                                <div className={s.inputContainer}>
                                    <DateInput />
                                    <input type="text" name="brand" className={s.inputBox} placeholder="ブランド" value={formData.brand} onChange={handleInputChange} />
                                    <input type="text" name="productName" className={s.inputBox} placeholder="商品名" value={formData.productName} onChange={handleInputChange} />
                                    <label className={s.inputLabel}>
                                        <input type="number" name="quantity" className={s.inputBoxMini} placeholder="個数" value={formData.quantity} onChange={handleInputChange} />個
                                    </label>
                                    <label className={s.inputLabel}>
                                        <input type="number" name="pricePerUnit" className={s.inputBoxMini} placeholder="1個あたりの価格" value={formData.pricePerUnit} onChange={handleInputChange} />円
                                    </label>
                                    <textarea name="memo" className={s.inputMemo} placeholder="メモ" value={formData.memo} onChange={handleInputChange} />
                                </div>
                                <div className={s.inputButtonContainer}>
                                    <button className={s.inputCancel} type="button" onClick={handleCancelAdd}>キャンセル</button>
                                    <button className={s.inputAdd} type="button" onClick={handleAddNewCosmeClick}>追加</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default MyCosmetics;
