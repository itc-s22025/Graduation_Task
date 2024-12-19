'use client';

import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { auth, db } from '@/firebase';
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import UnionPage from "@/components/union";
import s from './following.module.css';
import UnfollowModal from "@/components/UnfollowModel";
import { unfollowUser } from "@/UserFollow";

const Following = () => {
    const [followingUsers, setFollowingUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // 認証状態を監視する
        const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
            console.log(user);  // Log the user object
            if (!user) {
                console.error("ユーザーが認証されていません");
                router.push('/'); // ログインページにリダイレクト
                return;
            }

            // ユーザーが認証されている場合、フォローしているユーザーを取得
            const userRef = doc(db, "users", user.uid);

            const unsubscribe = onSnapshot(userRef, async (snapshot) => {
                if (snapshot.exists()) {
                    const followingIds = snapshot.data().following || [];
                    const users = await Promise.all(
                        followingIds.map(async (id) => {
                            const userRef = doc(db, "users", id);
                            const userSnapshot = await getDoc(userRef);
                            return userSnapshot.exists() ? { id, ...userSnapshot.data() } : null;
                        })
                    );
                    setFollowingUsers(users.filter(Boolean));
                } else {
                    console.warn("ユーザードキュメントが存在しません");
                }
            });

            return () => unsubscribe();
        });

        // クリーンアップ関数で認証リスナーを解除
        return () => unsubscribeAuth();
    }, [router]);

    const handleUnfollow = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    const confirmUnfollow = async () => {
        if (auth.currentUser && selectedUserId) {
            try {
                // フォロー解除処理
                await unfollowUser(auth.currentUser.uid, selectedUserId);
                setFollowingUsers(prevUsers =>
                    prevUsers.filter(user => user.id !== selectedUserId)
                );
                setShowModal(false);
            } catch (error) {
                console.error("フォロー解除中にエラーが発生しました:", error);
            }
        }
    };

    return (
        <MainLayout>
            <UnionPage />
            <h1 className={s.allContent}>Following</h1>
            <div className={s.content}>
                {followingUsers.length > 0 ? (
                    followingUsers.map(user => (
                        <div key={user.id} className={s.userCard}>
                            <img
                                src={user.icon || 'defaultIcon.png'}
                                alt="User Icon"
                                className={s.userIcon}
                                onClick={() => router.push(`/Profile/${user.id}`)}
                            />
                            <div className={s.userInfo}>
                                <p className={s.userName}>{user.name}</p>
                                <p className={s.userId}>@{user.displayId || "No ID"}</p>
                                <p className={s.bio}>{user.bio || "No Bio"}</p>
                                <button onClick={() => handleUnfollow(user.id)} className={s.unfollow}>
                                    Unfollow
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={s.followText}>フォローしているユーザーがいません。</p>
                )}
            </div>
            <UnfollowModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmUnfollow}
            />
        </MainLayout>
    );
};

export default Following;