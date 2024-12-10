"use client";

import s from '@/styles/myCosmeticItems.module.css';
import home from "@/app/Home/page.module.css";
import { useState } from "react";
import { db } from "@/firebase";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const MyCosmeticItems = ({ id, cosmeticsType, openDate, brand, productName, quantity, price, memo, updatedDate, imageUrl, isFavorite }) => {
    // state
    const [isEdit, setIsEdit] = useState(false);
    const [editItems, setEditItems] = useState(false);
    const [isFavoriteState, setIsFavoriteState] = useState(isFavorite || false);
    const [updatedData, setUpdatedData] = useState({ cosmeticsType, openDate, brand, productName, quantity, price, memo });
    const [isHovered, setIsHovered] = useState(false) // isEdit=trueのときのホバー

    // 編集ボタンの表示を切り替える
    const handleEditButtonClick = () => { setIsEdit(prev => !prev); }

    // アイテム編集画面の表示を切り替える
    const handleEditItemsClick = () => { setEditItems(prev => !prev); }

    // データベースのデータを更新
    const updateCosmetic = async () => {
        const cosmeticRef = doc(db, 'MyCosmetics', id);
        try {
            await updateDoc(cosmeticRef, {
                ...updatedData,
                updatedDate: serverTimestamp()
            });
            alert('マイコスメの情報を更新しました');
            setEditItems(false);
            setIsEdit(false);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const toggleFavorite = async () => {
        const newFavoriteState = !isFavoriteState; // 新しい状態を計算
        setIsFavoriteState(newFavoriteState); // UI更新用に状態を反転

        try {
            await handleFavoriteToggle(newFavoriteState); // DB更新用に新しい状態を渡す
        } catch (error) {
            console.error("Error updating favorite status: ", error);
            alert("お気に入りの更新に失敗しました");
        }
    };


    // お気に入り状態を切り替える関数
    const handleFavoriteToggle = async (newFavoriteState) => {
        const cosmeticDoc = doc(db, "MyCosmetics", id);
        try {
            await updateDoc(cosmeticDoc, {
                isFavorite: newFavoriteState, // 新しい状態を渡す
            });
        } catch (error) {
            console.error("お気に入りの更新中にエラーが発生しました: ", error);
        }
    };

    // Firestoreからコスメデータを削除
    const deleteCosmetic = async () => {
        try {
            const cosmeticDocRef = doc(db, "MyCosmetics", id);
            await deleteDoc(cosmeticDocRef);
            alert("コスメデータが削除されました");
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("削除中にエラーが発生しました");
        }
    }

    // 本当に削除していいか確認
    const onDeleteClick = () => {
        const confirmDelete = window.confirm("本当に削除しますか？");
        if (confirmDelete) {
            deleteCosmetic();
            setIsEdit(false);
        }
    }


    return (
        <>
            <div className={s.itemContainer}>
                <div className={s.flame}>
                    <div className={s.topContainer}>
                        <div className={s.exceptEditContainer}>
                            {/* ♡ */}
                            <div className={s.heart} onClick={toggleFavorite}><img src={isFavoriteState ? '/cutie_heart_after_mini.png' : '/cutie_heart_pink.png'} alt="Favorite Heart" /></div>
                            <p className={s.itemType}>{cosmeticsType}</p>
                            <div className={s.openDateContainer}>
                                <p className={s.dayText}>開封日：</p>
                                <p className={s.dayDate}>{openDate}</p>
                            </div>
                            <div className={s.updateDateContainer}>
                                <p className={s.dayText}>更新日：</p>
                                <p className={s.dayDate}>{updatedDate}</p>
                            </div>
                        </div>
                        <button type="button" className={s.edit} onClick={handleEditButtonClick}>…</button>
                    </div>

                    <div className={s.middleContainer}>
                        <img src={imageUrl? imageUrl:"no image"} className={s.img} alt="no image"/>
                        <div className={s.mMContainer}>
                            <div className={s.eachContainer}>
                                <p className={s.category}>ブランド：</p>
                                <p className={s.eachText}>{brand}</p>
                            </div>
                            <div className={s.eachContainer}>
                                <p className={s.category}>商品名：</p>
                                <p className={s.eachText}>{productName}</p>
                            </div>
                            <div className={s.eachContainer}>
                                <div className={s.amountContainer}>
                                    <p className={s.category}>個数：</p>
                                    <p className={s.eachText}>{quantity}</p>
                                </div>
                                <div className={s.priceContainer}>
                                    <p className={s.category}>価格：</p>
                                    <p className={s.eachText}>{price}円</p>
                                </div>
                            </div>
                            <div className={s.memoContainer}>
                                <p className={s.category}>メモ：</p>
                                <p className={s.memoText}>{memo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*　...　←押したとき */}
            {isEdit && (
                <div className={s.editContainer}>
                    <div className={s.editButtonContainer}>
                        <button type="button" className={`${s.editButton} ${isHovered ? s.noBorder : ''}`} onClick={handleEditItemsClick}>編集</button>
                        <button type="button" className={s.deleteButton} onClick={onDeleteClick} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>削除</button>
                    </div>
                    <button type="button" className={s.closeIsEdit} onClick={handleEditButtonClick}/>
                </div>
            )}

            {/* edit */}
            {editItems && (
                <div className={home.addTabOverlay}>
                    <div className={s.editContent}>
                        <h2 className={s.editTitle}>マイコスメを編集する</h2>

                        <div className={s.inputContainer}>

                            <label className={s.labelContainer}>コスメの種類：
                                <select
                                    name="cosmeticsType"
                                    className={s.selectBox}
                                    onChange={(e) => setUpdatedData({...updatedData, cosmeticsType: e.target.value})}
                                    value={updatedData.cosmeticsType}
                                >
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
                            </label>

                            <label className={s.labelContainer}>開封日：
                                <input
                                    type="date"
                                    value={updatedData.openDate}
                                    className={s.inputBox}
                                    onChange={(e) => setUpdatedData({...updatedData, openDate: e.target.value})}
                                />
                            </label>
                            <label className={s.labelContainer}>ブランド：
                                <input
                                    type="text"
                                    value={updatedData.brand}
                                    className={s.inputBox}
                                    onChange={(e) => setUpdatedData({...updatedData, brand: e.target.value})}
                                />
                            </label>

                            <label className={s.labelContainer}>商品名：
                                <input
                                    type="text"
                                    value={updatedData.productName}
                                    className={s.inputBox}
                                    onChange={(e) => setUpdatedData({ ...updatedData, productName: e.target.value })}
                                />
                            </label>

                            <label className={s.labelContainer}>所持している個数：
                                <input
                                    type="number"
                                    value={updatedData.quantity}
                                    className={s.inputBox}
                                    onChange={(e) => setUpdatedData({ ...updatedData, quantity: e.target.value })}
                                />個
                            </label>

                            <label className={s.labelContainer}>一個あたりの価格：
                                <input
                                    type="number"
                                    value={updatedData.price}
                                    className={s.inputBox}
                                    onChange={(e) => setUpdatedData({ ...updatedData, price: e.target.value })}
                                />円
                            </label>

                            <label className={s.labelContainer}>メモ：</label>
                            <textarea value={updatedData.memo} className={s.inputTextarea} onChange={(e) => setUpdatedData({ ...updatedData, memo: e.target.value })}/>

                            <div className={s.buttonContainer}>
                                <button type="button" className={s.cancelButton} onClick={() => { setEditItems(false); setIsEdit(false) }}>キャンセル</button>
                                <button type="button" className={s.saveButton} onClick={updateCosmetic}>更新</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyCosmeticItems;
