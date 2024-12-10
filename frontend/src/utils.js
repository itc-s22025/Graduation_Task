'use client';

import {doc, getDoc} from "firebase/firestore";
import {db} from "@/firebase";

// ユーザーが存在するか確認
export const checkUserExists = async (userId) => {
    if (!userId) {
        console.error("checkUserExists: userId が無効です:", userId);
        return false;
    }
    try {
        const userRef = doc(db, "users", userId); // Firestore の "users" コレクションから該当ドキュメントを取得
        const userSnapshot = await getDoc(userRef);
        const exists = userSnapshot.exists();
        console.log(`checkUserExists: userId (${userId}) の存在確認:`, exists);
        return exists;
    } catch (error) {
        console.error("checkUserExists: ユーザーの存在確認中にエラーが発生しました:", error);
        return false;
    }
};