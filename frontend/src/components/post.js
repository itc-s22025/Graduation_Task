"use client";

import s from '@/styles/post.module.css';
import { useEffect, useState } from "react";
import { db } from "../firebase";  // Firebase Firestoreをインポート
import { collection, onSnapshot } from "firebase/firestore";
import EachPost from "@/components/eachPost";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore"; // Firestoreの関数をインポート

const Post = () => {
    const [posts, setPosts] = useState([]); // 投稿リスト
    const [showEachPost, setShowEachPost] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [savedPosts, setSavedPosts] = useState([]); // 保存された投稿のIDを管理
    const router = useRouter();

    useEffect(() => {
        // Firestoreからリアルタイムで投稿を取得
        const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postsData);  // Firestoreから取得したデータをセット
        });

        return () => unsubscribe();  // クリーンアップ
    }, []);

    const handleEachPostClick = () => {
        setShowEachPost(true);
    };

    const handleReportButtonClick = () => {
        setShowReport(prev => !prev);
    };

    const handleCloseEachPost = () => {
        setShowEachPost(false);
    };

    const handleKeepClick = async (post) => {
        // Firestoreに保存
        const keepRef = doc(db, "keeps", post.id);
        await setDoc(keepRef, post);

        // 保存した投稿のIDを追加または削除
        setSavedPosts(prev =>
            prev.includes(post.id)
                ? prev.filter(id => id !== post.id)
                : [...prev, post.id]
        );
    };

    return (
        <>
            <div className={s.allContainer}>
                {posts.map((post) => (
                    <div key={post.id} className={`${s.all} ${savedPosts.includes(post.id) ? s.saved : ''}`}>
                        <div className={s.flex}>
                            <p className={s.icon}/>
                            <div>
                                <div className={s.topContainer}>
                                    <div className={s.infoContainer}>
                                        <p className={s.name}>{post.name || "Anonymous"}</p>
                                        <p className={s.userID}>@user1</p>
                                        <p className={s.time}>{post.timestamp?.toDate().toLocaleString()}</p>
                                    </div>
                                    <button type="button" className={s.editButton} onClick={handleReportButtonClick}>…</button>
                                </div>
                                <p className={s.content} onClick={handleEachPostClick}>{post.tweet}</p>
                                {post.imageUrl && <img src={post.imageUrl} alt="投稿画像" className={s.image} />}
                                <div className={s.reactionContainer}>
                                    <div className={s.flex}>
                                        <img src="/comment.png" className={s.reply} onClick={handleEachPostClick}/>
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
                                    <div className={s.flex} onClick={() => handleKeepClick(post)}>
                                        <div className={`${s.keep} ${savedPosts.includes(post.id) ? s.keepActive : ''}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Report Button */}
                {showReport && (
                    <div className={s.reportAllContainer}>
                        <button type="button" onClick={handleReportButtonClick} className={s.closeReportButton}/>
                        <div className={s.reportContainer}>
                            <button type="button" className={s.reportPostButton}>ポストを報告</button>
                            <button type="button" className={s.reportUserButton}>ユーザーを報告</button>
                        </div>
                    </div>
                )}

                {/* EachPostクリックしたとき */}
                {showEachPost && (
                    <div className={s.eachPostContainer}>
                        <div className={s.headerContainer}>
                            <button type="button" className={s.backButton} onClick={handleCloseEachPost}>←</button>
                            <h1 className={s.headerTitle}>Post</h1>
                            <button type="button" className={s.closeEachPost} onClick={handleCloseEachPost}/>
                        </div>
                        <EachPost />
                    </div>
                )}
            </div>
        </>
    );
}

export default Post;
