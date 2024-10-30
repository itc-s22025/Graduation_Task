"use client";

import s from '@/styles/myCosmeticItems.module.css';
import home from "@/app/Home/page.module.css";
import { useState } from "react";
import { db } from "@/firebase"; // firebaseの初期化が行われているファイルからimport
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"; // Firestoreからの削除を行うために必要

const MyCosmeticItems = ({ id, openDate, brand, productName, quantity, price, memo, updatedDate, fetchCosmeticsData }) => {
    // state
    const [isEdit, setIsEdit] = useState(false);
    const [editItems, setEditItems] = useState(false);
    const [updatedData, setUpdatedData] = useState({ openDate, brand, productName, quantity, price, memo });

    // show isEdit(...)
    const handleEditClick = () => {
        setIsEdit(prev => !prev);
    }

    // show edit page of items
    const handleEditItemsClick = () => {
        setEditItems(prev => !prev);
    }


    // データベースのデータを更新
    const updateCosmetic = async () => {
        const cosmeticRef = doc(db, 'MyCosmetics', id);
        try {
            await updateDoc(cosmeticRef, {
                ...updatedData,
                updatedDate: serverTimestamp()  // Firestoreのサーバー時刻を設定
            });
            alert('マイコスメの情報を更新しました');
            fetchCosmeticsData();  // データを再取得
            setEditItems(false);
            setIsEdit(false);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    // Firestoreからコスメデータを削除
   const deleteCosmetic = async () => {
       try {
           const cosmeticDocRef = doc(db, "MyCosmetics", id); // IDを元にドキュメントリファレンスを取得
           await deleteDoc(cosmeticDocRef); // ドキュメント削除
           alert("コスメデータが削除されました");
           fetchCosmeticsData(); // データを再取得
       } catch (error) {
           console.error("Error deleting document: ", error);
           alert("削除中にエラーが発生しました");
       }
   }

    // 本当に削除していいかきくやつ
    const onDeleteClick = () => {
        const confirmDelete = window.confirm("本当に削除しますか？"); // 確認ダイアログ
        if (confirmDelete) {
            deleteCosmetic(); // 確認が取れたら削除関数を呼び出す
            setIsEdit(false);
        }
    }

    return (
        <>
            <div className={s.itemContainer}>
                <div className={s.flame}>
                    <div className={s.topContainer}>
                        <button type="button" className={s.heart} /> {/* ♡ */}
                        <p className={s.itemType}>アイシャドウ</p>
                        <div className={s.openDayContainer}>
                            <p className={s.dayText}>開封日：</p>
                            <p className={s.dayDate}>{openDate}</p>
                        </div>
                        <div className={s.updateDayContainer}>
                            <p className={s.dayText}>更新日：</p>
                            <p className={s.dayDate}>{updatedDate}</p>
                        </div>
                        <button type="button" className={s.edit} onClick={handleEditClick}>…</button>
                    </div>

                    <div className={s.middleContainer}>
                        <p className={s.img} />
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

            {/*　...　←押したとき*/}
            {isEdit && (
                <div className={s.editContainer}>
                    <button type="button" className={s.editButton} onClick={handleEditItemsClick}>編集</button>
                    <button type="button" className={s.deleteButton} onClick={onDeleteClick}>削除</button>
                </div>
            )}

            {/*edit*/}
             {editItems && (
                 <div className={home.addTabOverlay}>
                     <div className={s.editContent}>
                         <h2 className={s.editTitle}>マイコスメを編集する</h2>

                         <div className={s.inputContainer}>
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
                                     onChange={(e) => setUpdatedData({...updatedData, productName: e.target.value})}
                                 />
                             </label>

                             <label className={s.labelContainer}>所持している個数：
                                 <input
                                     type="number"
                                     value={updatedData.quantity}
                                     className={s.inputBox}
                                     onChange={(e) => setUpdatedData({...updatedData, quantity: e.target.value})}
                                 />個
                             </label>

                             <label className={s.labelContainer}>一個あたりの価格：
                                 <input
                                     type="number"
                                     value={updatedData.price}
                                     className={s.inputBox}
                                     onChange={(e) => setUpdatedData({...updatedData, price: e.target.value})}
                                 />円
                             </label>

                             <label className={s.labelContainer}>メモ：</label>
                             <textarea value={updatedData.memo} className={s.inputTextarea} onChange={(e) => setUpdatedData({...updatedData, memo: e.target.value})}/>

                             <div className={s.buttonContainer}>
                                 <button type="button" className={s.cancelButton} onClick={() => { setEditItems(false); setIsEdit(false)} }>キャンセル</button>
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
