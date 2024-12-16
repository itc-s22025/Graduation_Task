'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import UnionPage from "@/components/union";
import UnfollowModal from "@/components/UnfollowModel";
import s from './following.module.css';
import { onSnapshot } from "firebase/firestore";
import { unfollowUser } from "@/UserFollow";
import { checkUserExists } from "@/utils";


const Following = () => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [followingUsers, setFollowingUsers] = useState([]);
    const router = useRouter();
    const auth = getAuth();

    const fetchFollowingUsers = (uid) => {
        const userRef = doc(db, "users", uid);

        return onSnapshot(userRef, async (docSnapshot) => {
            if (docSnapshot.exists()) {
                const followingIds = docSnapshot.data().following || [];
                const users = await Promise.all(
                    followingIds.map(async (id) => {
                        const userRef = doc(db, "users", id);
                        const snapshot = await getDoc(userRef);
                        if (!snapshot.exists()) {
                            console.warn(`fetchFollowingUsers: userId ${id} が存在しません。`);
                            return null;
                        }
                        return { id, ...snapshot.data() };
                    })
                );
                setFollowingUsers(users.filter(Boolean));
            } else {
                console.error(`fetchFollowingUsers: ユーザー ${uid} のドキュメントが存在しません。`);
            }
        });
    };

// useEffectでリアルタイム更新を購読
    useEffect(() => {
        let unsubscribe = null;
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                unsubscribe = fetchFollowingUsers(user.uid);
            } else {
                router.push('/'); // ログインページにリダイレクト
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
            unsubscribeAuth();
        };
    }, [auth, router]);

    const confirmUnfollow = async () => {
        if (auth.currentUser && selectedUserId) {
            const currentUserId = auth.currentUser.uid;

            console.log("Unfollow 処理開始: currentUserId:", currentUserId, "selectedUserId:", selectedUserId);

            const currentUserExists = await checkUserExists(currentUserId);
            const targetUserExists = await checkUserExists(selectedUserId);

            if (!currentUserExists) {
                console.error(`Unfollow: currentUserId (${currentUserId}) のデータが存在しません。`);
            }
            if (!targetUserExists) {
                console.error(`Unfollow: selectedUserId (${selectedUserId}) のデータが存在しません。`);
            }

            if (!currentUserExists || !targetUserExists) {
                alert("ユーザーのデータが見つかりませんでした。操作を中断します。");
                return;
            }

            try {
                await unfollowUser(currentUserId, selectedUserId);
                setFollowingUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== selectedUserId)
                );
                setSelectedUserId(null);
                closeModal();
            } catch (error) {
                console.error("フォロー解除中にエラーが発生しました:", error);
            }
        }
    };

    const handleUnfollowClick = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <MainLayout>
            <UnionPage/>
            <h1 className={s.allContent}>Following</h1>
            <div className={s.content}>
                {followingUsers.length > 0 ? (
                    followingUsers.map((user) => (
                        <div key={user.id} className={s.userCard}>
                            <img
                                src={user.icon || 'defaultIcon.png'}
                                alt="User Icon"
                                className={s.userIcon}
                                onClick={() => router.push(`/Profile/${user.id}`)}
                            />
                            <div className={s.userInfo}>
                                <p className={s.userName}>{user.name || "No Name"}</p>
                                <p className={s.userId}>@{user.displayId || "No ID"}</p>
                                <p className={s.bio}>{user.bio || "No Bio"}</p>
                                <button onClick={() => handleUnfollowClick(user.id)} className={s.unfollow}>
                                    UnFollow
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={s.followText}>フォローしているユーザーがいないか、一部のデータが見つかりません。</p>
                )}
            </div>

            <UnfollowModal isOpen={showModal} onClose={closeModal} onConfirm={confirmUnfollow}/>
        </MainLayout>
    );
};

export default Following;
