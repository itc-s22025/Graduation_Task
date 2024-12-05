"use client";

import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import { useState, useEffect } from "react";
import { db } from "../../firebase"; // Firebase Firestoreをインポート
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";

const Keeps = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [keepsIds, setKeepsIds] = useState([]); // 保存されている投稿のIDを保持

    useEffect(() => {
        // Firestoreから保存された投稿をリアルタイムで取得
        const unsubscribe = onSnapshot(collection(db, "keeps"), (snapshot) => {
            const keepsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(keepsData); // デバッグ用に取得したデータを表示
            setSavedPosts(keepsData);
            setKeepsIds(keepsData.map(post => post.id)); // IDリストも更新
        });

        return () => unsubscribe(); // クリーンアップ
    }, []);

    const handleToggleSave = async (post) => {
        const postRef = doc(db, "keeps", post.id);

        if (keepsIds.includes(post.id)) {
            // 投稿がKeepsにある場合は削除
            await deleteDoc(postRef);
            setKeepsIds(keepsIds.filter(id => id !== post.id));
        } else {
            // 投稿がKeepsにない場合は追加
            await setDoc(postRef, {
                ...post,
                timestamp: post.timestamp || new Date(), // タイムスタンプを更新
            });
            setKeepsIds([...keepsIds, post.id]);
        }
    };

    return (
        <>
            <MainLayout>
                <h1 className={s.title}>Keeps</h1>
                {savedPosts.length === 0 ? (
                    <p>保存された投稿はありません。</p>
                ) : (
                    <div className={s.allContainer}>
                        {savedPosts.map((post) => (
                            <div key={post.id} className={s.post}>
                                <div className={s.flex}>
                                    <img
                                        className={s.icon}
                                        alt="icon"
                                        src={post.icon || "/user_default.png"} // keeps.icon を post.icon に修正
                                        // onClick={() => router.push(`/AnotherScreen/${post.uid}`)} // 必要に応じて
                                    />
                                    <div>
                                        <div className={s.topContainer}>
                                            <div className={s.infoContainer}>
                                                <p className={s.name}>{post.name || "Anonymous"}</p>
                                                <p className={s.userID}>@{post.userId}</p>
                                                <p className={s.time}>{post.timestamp?.toDate().toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <p className={s.content}>{post.tweet}</p>
                                        {post.imageUrl && <img src={post.imageUrl} alt="投稿画像" className={s.image}/>}

                                        <div className={s.reactionContainer}>
                                            <div className={s.flex}>
                                                <img src="/comment.png" className={s.reply}/>
                                                <p className={s.reactionText}>0</p>
                                            </div>
                                            <div className={s.flex}>
                                                <div className={s.repost}/>
                                                <p className={s.reactionText}>0</p>
                                            </div>
                                            <div className={s.flex}>
                                                <div className={s.like}/>
                                                <p className={s.reactionText}>0</p>
                                            </div>
                                            <div className={s.flex}>
                                                <div
                                                    className={`${s.keep} ${keepsIds.includes(post.id) ? s.active : ""}`}
                                                    onClick={() => handleToggleSave(post)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </MainLayout>
        </>
    );
};

export default Keeps;
