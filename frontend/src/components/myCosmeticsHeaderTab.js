"use client"

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {useEffect, useState} from "react";
//styles
import s from "@/styles/myCosmeticsHeaderTab.module.css";
import home from "@/app/Home/page.module.css";
//firebase
import {addDoc, collection, getDocs, query, Timestamp, where} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "@/firebase";
//json
import brandData from "@/app/data/brand.json";


const MyCosmeticsHeaderTab = ({ tabs, handleAddTab, handleDeleteTab }) => {
    const [cosmeticsData, setCosmeticsData] = useState([]);
    //ログインしているユーザ
    const [currentUserUid, setCurrentUserUid] = useState(null);
    //新規コスメ登録
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        selectedTab: '',
        cosmeticsType: '',
        openDate: '',
        brand: '',
        productName: '',
        quantity: '',
        price: '',
        memo: '',
        updatedDate: '',
        imageUrl:'',
        isFavorite: false,
    });

    // タブ部分　UI
    const [focusedTab, setFocusedTab] = useState('all'); // state
    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    //DBからマイコスメ取得
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


    // 検索関連
    const [searchTerm, setSearchTerm] = useState(""); // 検索用の状態を追加
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    // 検索
    const handleSearch = async () => {
        if (!currentUserUid || !searchTerm) return;

        const cosmeticsCollection = collection(db, "MyCosmetics");
        const cosmeticsQuery = query(
            cosmeticsCollection,
            where("user_id", "==", currentUserUid)
        );

        const cosmeticsSnapshot = await getDocs(cosmeticsQuery);
        const matchingCosmetics = cosmeticsSnapshot.docs.filter((doc) => {
            const data = doc.data();
            // searchTermを含んでいるかチェック
            return (data.productName && data.productName.includes(searchTerm)) ||  // 商品名
                (data.brand && data.brand.includes(searchTerm)) ||   // ブランド名
                (data.cosmeticsType && data.cosmeticsType.includes(searchTerm)) ||  // コスメの種類
                (data.memo && data.memo.includes(searchTerm)) ; // memo
        });

        if (matchingCosmetics.length > 0) {
            alert("ありました");
            matchingCosmetics.forEach((doc) => {
                console.log(doc.data()); // ポストの内容を表示
            });
        } else {
            alert("見つかりませんでした");
        }
    };

    // コスメ追加ボタン(Add)押したときに出現させる
    const handleAddButtonClick = () => setIsAdding(!isAdding);
    // コスメ追加ボタン(Add)押した後に出現するキャンセルボタン
    const handleCancelAdd = () => setIsAdding(false);
    //  新規コスメ追加機能
    const handleAddNewCosmeClick = async () => {
        const { selectedTab, cosmeticsType, openDate, brand, productName, quantity, price } = formData;
        // バリデーション
        if (!cosmeticsType || !openDate || !brand || !productName || !quantity || !price) {
            alert("必須項目をすべて入力してください");
            return;
        }
        try {
            await addDoc(collection(db, "MyCosmetics"), {
                ...formData,
                selectedTab: selectedTab || "all", // 選択されたタブ、未選択なら "all"
                openDate: formData.openDate ? Timestamp.fromDate(new Date(formData.openDate)) : null,
                updatedDate: Timestamp.now(),
                user_id: currentUserUid,
            });
            alert("新しいコスメが登録されました");
            setFormData({
                selectedTab: "all", // 初期化
                cosmeticsType: '',
                openDate: '',
                brand: '',
                productName: '',
                quantity: '',
                price: '',
                memo: '',
                updatedDate: '',
                imageUrl: '',
                isFavorite: false,
            });
            setIsAdding(false);
            await fetchCosmeticsData();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("コスメの登録中にエラーが発生しました");
        }
    }

    //予測変換
    const [productNameSuggestions, setProductNameSuggestions] = useState([]);
    const [brandSuggestions, setBrandSuggestions] = useState([]);
    // ブランド変更時
    const handleBrandChange = (e) => {
        const inputValue = e.target.value;
        setFormData({ ...formData, brand: inputValue });

        // 入力値に応じてブランド候補をフィルタリング
        if (inputValue.trim() !== "") {
            const allBrands = Object.entries(brandData.brands).flatMap(([category, brands]) =>
                Object.keys(brands)
            );

            const suggestions = allBrands.filter((brand) =>
                brand.toLowerCase().includes(inputValue.toLowerCase())
            );

            setBrandSuggestions(suggestions);
        } else {
            setBrandSuggestions([]);
        }

        // 商品名サジェストをクリア
        setProductNameSuggestions([]);
    };

    // 商品名変更時
    const handleProductNameChange = (e) => {
        const inputValue = e.target.value;
        setFormData({ ...formData, productName: inputValue });

        if (formData.brand && inputValue.trim() !== "") {
            let brandProducts = [];
            for (const category in brandData.brands) {
                if (brandData.brands[category][formData.brand]) {
                    brandProducts = Object.entries(brandData.brands[category][formData.brand]);
                    break;
                }
            }

            const suggestions = brandProducts
                .filter(([productName]) => productName.toLowerCase().includes(inputValue.toLowerCase()))
                .map(([productName, details]) => ({
                    productName,
                    price: details.price || details[0], // JSON構造に応じて価格取得
                    imageUrl: details.image || "",  // 画像URLを取得
                }));

            setProductNameSuggestions(suggestions);

            if (suggestions.length === 1) {
                const { price, imageUrl } = suggestions[0];
                setFormData((prev) => ({ ...prev, price, imageUrl }));
            }
        } else {
            setProductNameSuggestions([]);
            setFormData((prev) => ({ ...prev, price: "", imageUrl: "" }));
        }
        console.log("img:::",formData)
    };



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
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                className={`${s.tabs} ${focusedTab === tab.name ? s.zIndex4 : ''}`}
                                tabIndex={focusedTab === 'all' ? 0 : index + 1}  // "All" タブを一番最初に表示
                                onFocus={() => handleFocus(tab.name)}
                                style={{
                                    zIndex: focusedTab === tab.name
                                        ? 4  // フォーカスしているタブが最前面
                                        : (tab.name === 'favorites' ? 2 : 1),  // favタブは2、他は1
                                    backgroundColor: tab.name === "all" ? "#fff"
                                        : tab.name === "favorites" ? "#FFDCDD" : "#FFBFC0", //背景色
                                    color: tab.name === "all" ? "#FF989A" : tab.name === "favorites" ? "#FF989A" : "#fff",  //文字色
                                    borderBottom: tab.name === "favorites" ? "none" : tab.name === "tab3" ? "none" : ""
                                }}
                            >
                                {tab.title}
                                {/* 必須タブ以外の場合に削除ボタンを表示 */}
                                {!["all", "favorites"].includes(tab.name) && (
                                    <button className={s.deleteTabButton} onClick={() => handleDeleteTab(tab.id)}>×</button>
                                )}
                            </Tab>
                        ))}
                        <Tab className={s.addTabButton} onClick={handleAddTab}>+</Tab>
                    </ul>
                </TabList>

                {/*search*/}
                <div className={s.searchAndAddContainer}>
                    <div className={s.searchContainer}>
                        <img alt="search_black" src="/search_black.png" className={s.searchImg}/>
                        <input type="search" className={s.searchBox} placeholder="search..." value={searchTerm} onChange={handleSearchChange}/>
                        <button type="button" className={s.searchButton} onClick={handleSearch}>Search</button>
                    </div>
                    <button type="button" className={s.addButton} onClick={handleAddButtonClick}>Add</button>
                </div>



                {/* Tab Panels */}
                {tabs.map((tab, index) => (
                    <TabPanel key={index}>
                        <article className={s.tabContent}>{tab.content}</article>
                    </TabPanel>
                ))}
            </Tabs>


            {/* コスメ追加ボタン(Add)押したとき　*/}
            {isAdding && (
                <div className={home.addTabOverlay}>
                    <div className={s.addTabContent}>
                        <h2 className={s.newCosmeticTitle}>新しいコスメを追加</h2>
                        <form>
                            <div className={s.inputContainer}>

                                <div className={s.includeImgContainer}>

                                    <div className={s.withOutImgContainer}>
                                        <label className={s.inputTabLabel}>追加するタブ：
                                            <select
                                                name="selectedTab"
                                                value={formData.selectedTab || "all"}
                                                className={s.selectTabBox}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    selectedTab: e.target.value
                                                })}
                                            >
                                                {tabs.filter((tab) => tab.name !== "favorites").map((tab) => (
                                                    <option key={tab.name} value={tab.name}>
                                                        {tab.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <select name="cosmeticsType" className={s.selectBox}
                                                onChange={handleInputChange}
                                                value={formData.cosmeticsType}>
                                            <option value="" disabled>コスメの種類を選択してください</option>
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

                                        {/*brand*/}
                                        <div>
                                            <input
                                                type="text"
                                                name="brand"
                                                className={s.inputBox}
                                                placeholder="ブランド"
                                                value={formData.brand}
                                                onChange={handleBrandChange}
                                            />
                                            {brandSuggestions.length > 0 && (
                                                <ul className={s.suggestionsList}>
                                                    {brandSuggestions.map((suggestion, index) => (
                                                        <li
                                                            key={index}
                                                            className={s.suggestionItem}
                                                            onClick={() => {
                                                                setFormData({...formData, brand: suggestion});
                                                                setBrandSuggestions([]); // 選択後は候補をクリア
                                                            }}
                                                        >
                                                            {suggestion}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                        </div>
                                    </div>

                                    {/* 商品画像のプレビュー */}
                                    {formData.imageUrl && (
                                        <div className={s.imagePreview}>
                                            <img src={formData.imageUrl} alt={formData.productName}
                                                 className={s.previewImage}/>
                                        </div>
                                    )}
                                </div>

                                {/* 商品名入力 */}
                                <div>
                                    <input
                                        type="text"
                                        name="productName"
                                        className={s.inputBoxOfProduct}
                                        placeholder="商品名"
                                        value={formData.productName}
                                        onChange={handleProductNameChange}
                                    />
                                    {productNameSuggestions.length > 0 && (
                                        <ul className={s.suggestionsList}>
                                            {productNameSuggestions.map(({ productName, price }) => (
                                                <li
                                                    key={productName}
                                                    onClick={() => {
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            productName,
                                                            price,
                                                        }));
                                                        setProductNameSuggestions([]); // サジェスト候補をクリア
                                                    }}
                                                >
                                                    {productName}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className={s.quantityAndPrice}>
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
                                </div>

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
