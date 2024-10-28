"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import home from "@/app/Home/page.module.css";
import HeaderTab from "@/components/headerTab";
import MyCosmeticItems from "@/components/myCosmeticItems";
import { db } from "@/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore"; // Firestoreの関数をインポート

const MyCosmetics = ({ pageType }) => {
    // state
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
    const [cosmeticsData, setCosmeticsData] = useState([]); // コスメアイテムを保存するための状態

    // データを取得する関数
    const fetchCosmeticsData = async () => {
        const cosmeticsCollection = collection(db, "MyCosmetics");
        const cosmeticsSnapshot = await getDocs(cosmeticsCollection);
        const cosmeticsList = cosmeticsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() // ドキュメントのデータを展開
        }));
        setCosmeticsData(cosmeticsList); // 状態に保存
    };

    // コンポーネントがマウントされたときにデータを取得
    useEffect(() => {
        fetchCosmeticsData(); // データを初回に取得
    }, []); // 空の依存配列を渡して初回レンダリング時に実行

    const handleAddClick = () => {
        setShowAddTab(true);
    };
    const handleCloseAddTab = () => {
        setShowAddTab(false);
    };

    // 新規コスメADD
    const handleAddButtonClick = () => {
        setIsAdding(!isAdding);
    };
    const handleCancelAdd = () => {
        setIsAdding(false);
    };

    const handleAddNewCosmeClick = async () => {
        try {
            // Firestoreに新しいコスメ情報を追加
            await addDoc(collection(db, "MyCosmetics"), {
                openDate: formData.openDate,
                brand: formData.brand,
                productName: formData.productName,
                quantity: formData.quantity,
                pricePerUnit: formData.pricePerUnit,
                memo: formData.memo,
            });
            alert("新しいコスメが登録されました");

            // データを再取得
            await fetchCosmeticsData(); // ここを修正

            // フォームをリセット
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

    // 入力データの変更を管理する
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 開封日 プレースホルダー変更用
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
    }

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    {/* header */}
                    <div className={s.headerContainer}>
                        <p className={s.headerText}>My Cosmetics</p>
                        <HeaderTab firstTabText={"カラコン"} secondTabText={"コスメ"} thirdTabText={"♥"}
                                   pageType="myCosmetics"/>
                        <button className={`${home.addButton}`} style={{ top: '63px' }} onClick={handleAddClick}>+</button>
                    </div>

                    <div className={s.searchAndAddContainer}>
                        {/* search */}
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
                        <div className={home.addTabOverlay}>
                            <div className={s.addTabContent}>
                                <h2 className={s.newCosmeticTitle}>新しいコスメを追加</h2>
                                <form>
                                    <div className={s.inputContainer}>
                                        <DateInput />
                                        <input type="text" name="brand" className={s.inputBox} placeholder="ブランド" value={formData.brand} onChange={handleInputChange} />
                                        <input type="text" name="productName" className={s.inputBox} placeholder="商品名" value={formData.productName} onChange={handleInputChange} />
                                        <div>
                                            <label className={s.inputLabel}>
                                                <input type="number" name="quantity" className={s.inputBoxMini} placeholder="個数" value={formData.quantity} onChange={handleInputChange} />個
                                            </label>
                                        </div>
                                        <div>
                                            <label className={s.inputLabel}>
                                                <input type="number" name="pricePerUnit" className={s.inputBoxMini} placeholder="1個あたりの価格" value={formData.pricePerUnit} onChange={handleInputChange} />円
                                            </label>
                                        </div>
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
        </>
    );
};

export default MyCosmetics;
