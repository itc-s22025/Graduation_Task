import { doc, updateDoc, arrayUnion, arrayRemove, runTransaction } from "firebase/firestore";
import { db } from '@/firebase';

// フォロー
export const followUser = async (currentUserId, targetUserId) => {
    try {
        const userRef = doc(db, "users", currentUserId);
        await updateDoc(userRef, {
            following: arrayUnion(targetUserId) // 追従リストに追加
        });

        const targetUserRef = doc(db, "users", targetUserId);
        await updateDoc(targetUserRef, {
            followers: arrayUnion(currentUserId) // フォロワーリストに追加
        });

        console.log(`ユーザー ${targetUserId} をフォローしました。`);
    } catch (error) {
        console.error("フォロー中にエラーが発生しました:", error);
    }
};

// フォロー解除
export const unfollowUser = async (currentUserId, targetUserId) => {
    if (!currentUserId || !targetUserId) {
        console.error("無効なユーザーIDです");
        return;
    }

    const currentUserRef = doc(db, "users", currentUserId);
    const targetUserRef = doc(db, "users", targetUserId);

    try {
        await runTransaction(db, async (transaction) => {
            const currentUserDoc = await transaction.get(currentUserRef);
            const targetUserDoc = await transaction.get(targetUserRef);

            if (!currentUserDoc.exists()) {
                throw new Error(`currentUserId: ${currentUserId}のドキュメントが存在しません`);
            }
            if (!targetUserDoc.exists()) {
                throw new Error(`targetUserId: ${targetUserId}のドキュメントが存在しません`);
            }

            transaction.update(currentUserRef, {
                following: arrayRemove(targetUserId),
            });
            transaction.update(targetUserRef, {
                followers: arrayRemove(currentUserId),
            });
        });
    } catch (error) {
        console.error("フォロー解除中にエラーが発生しました:", error);
    }
};
