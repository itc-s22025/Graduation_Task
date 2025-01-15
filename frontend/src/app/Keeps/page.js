"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase設定ファイルを正しいパスでインポートしてください
import MainLayout from "../../components/MainLayout"; // 適切なレイアウトをインポート
import s from "./page.module.css"; // CSSモジュール

const Keeps = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [keepsIds, setKeepsIds] = useState([]);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            const querySnapshot = await getDocs(collection(db, "keeps"));
            const posts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSavedPosts(posts);
            setKeepsIds(posts.map((post) => post.id));
        };

        fetchSavedPosts();
    }, []);

    const handleToggleSave = async (post) => {
        // 保存ボタンの処理を実装
        console.log("保存機能の切り替えを実装してください");
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
                                        src={post.icon || "/user_default.png"}
                                    />
                                    <div>
                                        <div className={s.topContainer}>
                                            <div className={s.infoContainer}>
                                                <p className={s.name}>{post.name || "Anonymous"}</p>
                                                <p className={s.userID}>@{post.userId}</p>
                                                <p className={s.time}>
                                                    {post.timestamp?.toDate().toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={s.content}>{post.tweet}</p>
                                        {post.imageUrl && (
                                            <img
                                                src={post.imageUrl}
                                                alt="投稿画像"
                                                className={s.image}
                                            />
                                        )}

                                        <div className={s.reactionContainer}>
                                            <div className={s.flex}>
                                                <img src="/comment.png" className={s.reply} />
                                                <p className={s.reactionText}>0</p>
                                            </div>
                                            <div className={s.flex}>
                                                <div className={s.repost} />
                                                <p className={s.reactionText}>0</p>
                                            </div>
                                            <div className={s.flex}>
                                                <div className={s.like} />
                                                <p className={s.reactionText}>0</p>
                                            </div>
                                            <div className={s.flex}>
                                                <div
                                                    className={`${s.keep} ${
                                                        keepsIds.includes(post.id) ? s.active : ""
                                                    }`}
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
