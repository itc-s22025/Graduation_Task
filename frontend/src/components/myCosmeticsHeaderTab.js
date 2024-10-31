"use client"

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {useEffect, useState} from "react";
import s from "@/styles/myCosmeticsHeaderTab.module.css";
import home from "@/app/Home/page.module.css";
import {addDoc, collection, getDocs, query, Timestamp, where} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "@/firebase";

const MyCosmeticsHeaderTab = ({ firstTabText, secondTabText, firstTabContent, secondTabContent, pageType }) => {

    const [cosmeticsData, setCosmeticsData] = useState([]);
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        cosmeticsType: '',
        openDate: '',
        brand: '',
        productName: '',
        quantity: '',
        price: '',
        memo: '',
        updatedDate: '',
        isFavorite: false,
    });

    // タブ部分
    const [focusedTab, setFocusedTab] = useState(''); // state
    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

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

    // const favoriteItems = cosmeticsData.filter(item => item.isFavorite);

    useEffect(() => {
        fetchCosmeticsData();
    }, [currentUserUid]);

    // コスメ追加ボタン(Add)押したときに出現させる
    const handleAddButtonClick = () => setIsAdding(!isAdding);
    // コスメ追加ボタン(Add)押した後に出現するキャンセルボタン
    const handleCancelAdd = () => setIsAdding(false);
    //  新規コスメ追加機能
    const handleAddNewCosmeClick = async () => {
        const { cosmeticsType, openDate, brand, productName, quantity, price } = formData;
        // バリデーション
        if (!cosmeticsType || !openDate || !brand || !productName || !quantity || !price) {
            alert("必須項目をすべて入力してください");
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
                isFavorite: false,
            });
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("コスメの登録中にエラーが発生しました");
        }
    }

    // myCosmeticItems.jsで編集したとき、その値を反映させるやつ
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 日付のフォーマット整えるやつ
    const formatDateTime = (date) => {
        if (!date) return "";
        const d = date instanceof Timestamp ? date.toDate() : new Date(date);
        const year = d.getFullYear();
        const month = ("0" + (d.getMonth() + 1)).slice(-2);
        const day = ("0" + d.getDate()).slice(-2);
        return `${year}/${month}/${day}`;
    };
    //日付のフォーマット変えるやつ
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


    return(
        <>
            <Tabs>
                <TabList className={s.all}>
                    <ul className={s.ul}>
                        <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''}`}
                             onFocus={() => handleFocus('tabFirst')} tabIndex={0}>
                            {firstTabText}
                        </Tab>
                        <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`}
                             onFocus={() => handleFocus('tabSecond')} tabIndex={0}>
                            {secondTabText}
                        </Tab>
                    </ul>
                </TabList>

                {/*search*/}
                <div className={s.searchAndAddContainer}>
                    <div className={s.searchContainer}>
                        <img alt="search_black" src="/search_black.png" className={s.searchImg}/>
                        <input type="search" className={s.searchBox} placeholder="search..."/>
                        <button type="button" className={s.searchButton}>Search</button>
                    </div>
                    <button type="button" className={s.addButton} onClick={handleAddButtonClick}>Add</button>
                </div>

                {/* Tab Panels */}
                <TabPanel>
                    <article>
                        {firstTabContent}
                    </article>
                </TabPanel>

                <TabPanel>
                    <article>
                        {secondTabContent}
                    </article>
                </TabPanel>

            </Tabs>


            {/* コスメ追加ボタン(Add)押したとき　*/}
            {isAdding && (
                <div className={home.addTabOverlay}>
                    <div className={s.addTabContent}>
                        <h2 className={s.newCosmeticTitle}>新しいコスメを追加</h2>
                        <form>
                            <div className={s.inputContainer}>
                                <select name="cosmeticsType" className={s.selectBox} onChange={handleInputChange} value={formData.cosmeticsType}>
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
                                <DateInput/>
                                <input type="text" name="brand" className={s.inputBox} placeholder="ブランド"
                                       value={formData.brand} onChange={handleInputChange}/>
                                <input type="text" name="productName" className={s.inputBox} placeholder="商品名"
                                       value={formData.productName} onChange={handleInputChange}/>
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
                                <button type="button" onClick={handleCancelAdd}
                                        className={s.inputCancel}>キャンセル
                                </button>
                                <button type="button" onClick={handleAddNewCosmeClick} className={s.inputAdd}>追加
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* 追加機能 */}
            {/*{additionalFeatures && (*/}
            {/*    <div className={s.additionalFeatures}>*/}
            {/*        {additionalFeatures}*/}
            {/*    </div>*/}
            {/*)}*/}

        </>
    )
}

export default MyCosmeticsHeaderTab;