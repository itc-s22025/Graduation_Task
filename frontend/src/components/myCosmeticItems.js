"use client";

import s from '@/styles/myCosmeticItems.module.css';
import { useState } from "react";
import { db } from "@/firebase"; // firebaseの初期化が行われているファイルからimport
import { doc, deleteDoc } from "firebase/firestore"; // Firestoreからの削除を行うために必要

const MyCosmeticItems = ({ id, openDate, brand, productName, quantity, price, memo, fetchCosmeticsData }) => {
    // state
    const [isEdit, setIsEdit] = useState(false);

    // show isEdit
    const handleEditClick = () => {
        setIsEdit(prev => !prev);
    }

    // Firestoreからコスメデータを削除する関数
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


    // delete button click handler with confirmation
    const onDeleteClick = () => {
        const confirmDelete = window.confirm("本当に削除しますか？"); // 確認ダイアログ
        if (confirmDelete) {
            deleteCosmetic(); // 確認が取れたら削除関数を呼び出す
        }
        setIsEdit(false);
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
                            <p className={s.dayDate}>2024/12/22</p>
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

            {isEdit && (
                <div className={s.editContainer}>
                    <button type="button" className={s.editButton}>編集</button>
                    <button type="button" className={s.deleteButton} onClick={onDeleteClick}>削除</button>
                </div>
            )}
        </>
    );
};

export default MyCosmeticItems;
