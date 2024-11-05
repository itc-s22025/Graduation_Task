"use client";

import s from '@/styles/post.module.css';
import { useEffect, useState } from "react";
import { db } from "../firebase";  // Firebase Firestoreをインポート
import { collection, onSnapshot } from "firebase/firestore";
import EachPost from "@/components/eachPost";

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [showEachPost, setShowEachPost] = useState(false);
    const [showReport, setShowReport] = useState(false);

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

    return (
        <>
            <div className={s.allContainer}>
                {posts.map((post) => (
                    <div key={post.id} className={s.all}>
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
                                    <div className={s.flex}>
                                        <div className={s.keep}/>
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
