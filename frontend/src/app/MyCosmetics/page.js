"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import home from "@/app/Home/page.module.css";
import HeaderTab from "@/components/headerTab";
import MyCosmeticItems from "@/components/myCosmeticItems";

const MyCosmetics = ({ pageType }) => {
    // state
    const [cosmeticsData, setCosmeticsData] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState(null);   // 今ログインしているユーザ
    const [showAddTab, setShowAddTab] = useState(false);    //addTab
    const [isAdding, setIsAdding] = useState(false);    //コスメaddボタン
    // DBに登録するMyCosmeticsデータ
    const [formData, setFormData] = useState({
        cosmeticsType:'',
        openDate: '',
        brand: '',
        productName: '',
        quantity: '',
        price: '',
        memo: '',
        updatedDate: '',
        isFavorite: false
    });

    const formatDateTime = (date) => {
        if (!date) return "";
        const d = date instanceof Timestamp ? date.toDate() : new Date(date);
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}/${month}/${day}`;
    };

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
    };

    useEffect(() => {
        fetchCosmeticsData();
    }, [currentUserUid]);

    // 新しいコスメを追加
    // MyCosmetics component内
    const handleAddNewCosmeClick = async () => {
        // 必須項目チェックバリデーション
        const { cosmeticsType, openDate, brand, productName, quantity, price } = formData;
        if (!cosmeticsType || !openDate || !brand || !productName || !quantity || !price) {
            alert("必須項目をすべて入力してください"); // エラーメッセージを表示
            return;
        }

        try {
            await addDoc(collection(db, "MyCosmetics"), {
                ...formData,
                openDate: formData.openDate ? Timestamp.fromDate(new Date(formData.openDate)) : null,
                updatedDate: Timestamp.now(),
                user_id: currentUserUid,
            });
            alert("新しいコスメが登録されました");
            await fetchCosmeticsData();
            setFormData({
                cosmeticsType: '',
                openDate: '',
                brand: '',
                productName: '',
                quantity: '',
                price: '',
                memo: '',
                updatedDate: '',
                isFavorite: false
            });
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("コスメの登録中にエラーが発生しました");
        }
    }


        // フォーム入力の変更を管理
        const handleInputChange = (e) => {
            const {name, value} = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };

        // タブ表示
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

                    {/*ヘッダー(タブ)*/}
                    <div className={s.headerContainer}>
                        <p className={s.headerText}>My Cosmetics</p>
                        <HeaderTab firstTabText={"カラコン"} secondTabText={"コスメ"} thirdTabText={"♥"}
                                   pageType="myCosmetics"/>
                        <button className={`${home.addButton}`} style={{top: '63px'}} onClick={handleAddClick}>+
                        </button>
                    </div>

                    {/*サーチ欄*/}
                    <div className={s.searchAndAddContainer}>
                        <div className={s.searchContainer}>
                            <img alt="search_black" src="/search_black.png" className={s.searchImg}/>
                            <input type="search" className={s.searchBox} placeholder="search..."/>
                            <button type="button" className={s.searchButton}>Search</button>
                        </div>
                        <button type="button" className={s.addButton} onClick={handleAddButtonClick}>Add</button>
                    </div>

                    {/*アイテム群*/}
                    <div className={s.itemsContainer}>
                        {cosmeticsData.map((cosmetic) => (
                           <MyCosmeticItems
                               key={cosmetic.id}
                               id={cosmetic.id}
                               cosmeticsType={cosmetic.cosmeticsType}
                               openDate={formatDateTime(cosmetic.openDate)}
                               brand={cosmetic.brand}
                               productName={cosmetic.productName}
                               quantity={cosmetic.quantity}
                               price={cosmetic.price}
                               memo={cosmetic.memo}
                               updatedDate={formatDateTime(cosmetic.updatedDate)}
                               fetchCosmeticsData={fetchCosmeticsData}
                           />

                        ))}
                    </div>

                    {/*タブ追加ボタン押下したとき*/}
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
                                        <button type="button" onClick={handleCloseAddTab}
                                                className={s.addTabCancel}>キャンセル
                                        </button>
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

                                        <div>
                                            <select name="cosmeticsType" className={s.selectBox}
                                                    onChange={handleInputChange} value={formData.cosmeticsType}>
                                                <option value="">コスメの種類を選択してください</option>
                                                <option value="アイシャドウ">アイシャドウ</option>
                                                <option value="アイブロウ用品">アイブロウ用品</option>
                                                <option value="アイライナー">アイライナー</option>
                                                <option value="香水・フレグランス">香水・フレグランス</option>
                                                <option value="基礎化粧品">基礎化粧品</option>
                                                <option value="化粧下地">化粧下地</option>
                                                <option value="コンシーラー">コンシーラー</option>
                                                <option value="チーク">チーク</option>
                                                <option value="ハイライター">ハイライター</option>
                                                <option value="日焼け止め">日焼け止め</option>
                                                <option value="ファンデーション">ファンデーション</option>
                                                <option value="フェイスパウダー">フェイスパウダー</option>
                                                <option value="ヘアケア用品">ヘアケア用品</option>
                                                <option value="ボディケア用品">ボディケア用品</option>
                                                <option value="マスカラ">マスカラ</option>
                                                <option value="メイクアップグッズ">メイクアップグッズ</option>
                                                <option value="リップ">リップ</option>
                                                <option value="その他">その他</option>
                                            </select>
                                        </div>
                                        <DateInput/>
                                        <input type="text" name="brand" className={s.inputBox} placeholder="ブランド"
                                               value={formData.brand} onChange={handleInputChange}/>
                                        <input type="text" name="productName" className={s.inputBox}
                                               placeholder="商品名" value={formData.productName}
                                               onChange={handleInputChange}/>
                                        <label className={s.inputLabel}>
                                            <input type="number" name="quantity" className={s.inputBoxMini}
                                                   placeholder="個数" value={formData.quantity}
                                                   onChange={handleInputChange}/>個
                                        </label>
                                        <label className={s.inputLabel}>
                                            <input type="number" name="price" className={s.inputBoxMini}
                                                   placeholder="1個あたりの価格" value={formData.price}
                                                   onChange={handleInputChange}/>円
                                        </label>
                                        <textarea name="memo" className={s.inputMemo} placeholder="メモ"
                                                  value={formData.memo} onChange={handleInputChange}/>
                                    </div>
                                    <div className={s.inputButtonContainer}>
                                        <button className={s.inputCancel} type="button"
                                                onClick={handleCancelAdd}>キャンセル
                                        </button>
                                        <button className={s.inputAdd} type="button"
                                                onClick={handleAddNewCosmeClick}>追加
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </MainLayout>
        );
}

export default MyCosmetics;
