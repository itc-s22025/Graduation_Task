'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from "firebase/firestore"; // 修正済み
import { auth, db } from '@/firebase';
import { useRouter, useSearchParams } from "next/navigation";
import s from './followers.module.css';
import { followUser } from '@/UserFollow';
import MainLayout from '@/components/MainLayout';
import UnionPage from "@/components/union";

const Followers = () => {
    const [followers, setFollowers] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId'); // Get the userId from query params

    useEffect(() => {
        const fetchFollowers = async () => {
            if (!auth.currentUser) {
                console.error("ユーザーが認証されていません");
                router.push('/'); // ログインページにリダイレクト
                return;
            }

            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef); // 修正済み

                if (userDoc.exists()) {
                    const followerIds = userDoc.data().followers || [];
                    const users = await Promise.all(
                        followerIds.map(async (id) => {
                            const userRef = doc(db, "users", id);
                            const userSnapshot = await getDoc(userRef); // 修正済み
                            return userSnapshot.exists() ? { id, ...userSnapshot.data() } : null;
                        })
                    );

                    setFollowers(users.filter(Boolean));
                } else {
                    console.warn("ユーザードキュメントが存在しません");
                }
            } catch (error) {
                console.error("フォロワーデータ取得中にエラーが発生しました:", error);
            }
        };

        fetchFollowers();
    }, []); // 空の依存配列にする

    return (
        <MainLayout>
            <UnionPage />
            <h1 className={s.allContent}>Followers</h1>
            {followers.length > 0 ? (
                followers.map(user => (
                    <div key={user.id} className={s.userCard}>
                        <img
                            src={user.icon || 'defaultIcon.png'}
                            alt={`${user.name}のアイコン`}
                            className={s.userIcon}
                            onClick={() => router.push(`/Profile/${user.id}`)}
                        />
                        <div className={s.userInfo}>
                        <p className={s.userName}>{user.name}</p>
                        <p className={s.userId}>@{user.displayId || "No ID"}</p>
                        <p className={s.bio}>{user.bio || "No Bio"}</p>
                        <button className={s.follow} onClick={() => followUser(auth.currentUser.uid, user.id)}>
                            Follow
                        </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className={s.followText}>フォロワーはいません。</p>
            )}
        </MainLayout>
    );
};

export default Followers;


// 'use client';
//
// import React, { useState, useEffect } from 'react';
// import { doc, getDoc, onSnapshot } from "firebase/firestore";
// import { auth, db } from '@/firebase';
// import { useRouter, useSearchParams } from "next/navigation";
// import s from './followers.module.css';
// import { followUser } from '@/UserFollow';
// import MainLayout from '@/components/MainLayout';
// import UnionPage from "@/components/union";
//
// const Followers = () => {
//     const [followers, setFollowers] = useState([]);
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const userId = searchParams.get('userId'); // Get the userId from query params
//
//     useEffect(() => {
//         const fetchFollowers = async () => {
//             if (!auth.currentUser) {
//                 console.error("ユーザーが認証されていません");
//                 router.push('/'); // ログインページにリダイレクト
//                 return;
//             }
//
//             try {
//                 const userRef = doc(db, "users", auth.currentUser.uid);
//                 const userDoc = await getDoc(userRef);
//
//                 if (userDoc.exists()) {
//                     const followerIds = userDoc.data().followers || [];
//                     const users = await Promise.all(
//                         followerIds.map(async (id) => {
//                             const userRef = doc(db, "users", id);
//                             const snapshot = await getDoc(userRef);
//                             return snapshot.exists() ? { id, ...snapshot.data() } : null;
//                         })
//                     );
//
//                     setFollowers(users.filter(Boolean));
//                 } else {
//                     console.warn("ユーザードキュメントが存在しません");
//                 }
//             } catch (error) {
//                 console.error("フォロワーデータ取得中にエラーが発生しました:", error);
//             }
//         };
//
//         fetchFollowers();
//     }, []); // 空の依存配列にする
//
//     return (
//         <MainLayout>
//             <UnionPage />
//             <h1 className={s.allContent}>Followers</h1>
//             {followers.length > 0 ? (
//                 followers.map(user => (
//                     <div key={user.id} className={s.userCard}>
//                         <img
//                             src={user.icon || 'defaultIcon.png'}
//                             alt={`${user.name}のアイコン`}
//                             className={s.userIcon}
//                             onClick={() => router.push(`/Profile/${user.id}`)}
//                         />
//                         <span className={s.userName}>{user.name}</span>
//                         <button className={s.follow} onClick={() => followUser(auth.currentUser.uid, user.id)}>
//                             Follow
//                         </button>
//                     </div>
//                 ))
//             ) : (
//                 <p className={s.followText}>フォロワーはいません。</p>
//             )}
//         </MainLayout>
//     );
// };
//
// export default Followers;