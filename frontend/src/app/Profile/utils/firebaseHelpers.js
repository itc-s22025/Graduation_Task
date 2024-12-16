import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

async function getUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                following: userData.following || [],
                followers: userData.followers || [],
            };
        } else {
            console.error("ユーザーが見つかりませんでした");
            return { following: [], followers: [] };
        }
    } catch (error) {
        console.error("データ取得中にエラーが発生しました:", error);
        return { following: [], followers: [] };
    }
}
