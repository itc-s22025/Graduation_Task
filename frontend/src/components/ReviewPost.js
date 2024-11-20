'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/firebase"; // Firebase関連
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import EachPost from "@/components/eachPost";
import s from "../styles/ReviewPosts.module.css";

const ReviewPosts = ({ userId, searchPost, pageType }) => {
    const pathname = usePathname();
    const router = useRouter();

    const [reviews, setReviews] = useState([]); // レビュー投稿リスト
    const [currentUserUid, setCurrentUserUid] = useState(null); // 現在のユーザーUID
    const [showEachPost, setShowEachPost] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [savedPosts, setSavedPosts] = useState([]); // 保存した投稿のIDリスト

    // ユーザー認証状態の監視
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    // Firestoreからレビュー投稿データを取得
    useEffect(() => {
        const reviewQuery = query(
            collection(db, "ReviewPosts"),
            orderBy("timestamp", "desc") // 投稿時刻でソート
        );

        const unsubscribe = onSnapshot(reviewQuery, (snapshot) => {
            const reviewData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // 検索条件がある場合のフィルタリング
            let filteredReviews = reviewData;
            if (pathname === '/Profile' && currentUserUid) {
                filteredReviews = filteredReviews.filter(review => review.uid === currentUserUid);
            }

            if (searchPost) {
                filteredReviews = filteredReviews.filter(review =>
                    review.review.toLowerCase().includes(searchPost.toLowerCase())
                );
            }

            setReviews(filteredReviews);
        });

        return () => unsubscribe(); // クリーンアップ
    }, [currentUserUid, pathname, searchPost]);

    // 投稿詳細表示のトグル
    const handleEachPostClick = (post) => {
        setSelectedPost(post);
        setShowEachPost(true);
    };

    const handleCloseEachPost = () => {
        setShowEachPost(false);
        setSelectedPost(null);
    };

    // 日付フォーマット
    const formatTimestamp = (timestamp) => {
        const postDate = timestamp.toDate();
        return postDate.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // 保存ボタンのクリック時の動作（ダミー）
    const handleReportButtonClick = (postId) => {
        // 保存機能の実装
        if (savedPosts.includes(postId)) {
            setSavedPosts(savedPosts.filter(id => id !== postId));
        } else {
            setSavedPosts([...savedPosts, postId]);
        }
    };

    return (
        <div className={s.allContainer}>
            {reviews.length === 0 ? (
                <p className={s.noPosts}>レビューがまだありません。</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} className={`${s.all} ${savedPosts.includes(review.id) ? s.saved : ''}`}>
                        <div className={s.includeIconsContainer}>
                            <div className={s.iconContainer}>
                                <img
                                    className={s.iconImage}
                                    alt="icon"
                                    src={review.icon || "/user_default.png"}
                                    onClick={() => router.push(`/AnotherScreen/${review.uid}`)}
                                />
                            </div>

                            <div className={s.topContainer}>
                                <div className={s.topMiddleContainer}>
                                    <div className={s.infoContainer}>
                                        <p className={s.name}>{review.name || "Anonymous"}</p>
                                        <p className={s.userID}>@{review.displayId || "user1"}</p>
                                        <p className={s.pc}>{review.personalColor || "未設定"}</p>
                                        <p className={s.time}>{formatTimestamp(review.timestamp)}</p>
                                    </div>
                                    <div className={s.contentContainer} onClick={() => handleEachPostClick(review)}>
                                        <p className={s.brand}>ブランド : {review.brand}</p>
                                        <p className={s.product}>商品名 : {review.productName}</p>
                                        <p className={s.star}>おすすめ度 : {review.star}</p>
                                        <p className={s.review}>レビュー : {review.review}</p>
                                        {review.imageUrl && (
                                            <img
                                                src={review.imageUrl}
                                                alt="レビュー画像"
                                                className={s.image}
                                            />
                                        )}
                                    </div>
                                </div>
                                <button type="button" className={s.editButton} onClick={() => handleReportButtonClick(review.id)}>…</button>
                            </div>
                        </div>
                        {/*リプライとか reaction*/}
                        <div className={s.reactionContainer}>
                            <div className={s.flex}> {/* reply */}
                                <img alt="リプライアイコン" src="/comment.png" className={s.reply}
                                     onClick={() => handleEachPostClick(selectedPost)} />
                                <p className={s.reactionText}>0</p>
                            </div>
                            <div className={s.flex}> {/* repost */}
                                <img alt="リポストアイコン"
                                     src={
                                         selectedPost && selectedPost.repostedBy.includes(currentUserUid)
                                             ? "/repost_after.png"
                                             : "/repost_before.png"
                                     }
                                     className={s.repost}
                                />
                                <p className={s.reactionText}>0</p>
                            </div>
                            <div className={s.flex}> {/* like */}
                                <img alt="いいねアイコン"
                                     src={
                                         selectedPost && selectedPost.likedBy.includes(currentUserUid)
                                             ? "/cutie_heart_after.png"
                                             : "/cutie_heart_before.png"
                                     }
                                     className={s.like}
                                />
                                <p className={s.reactionText}>0</p>
                            </div>
                            <div className={s.flex} onClick={() => handleReportButtonClick(selectedPost?.id)}>
                                <div className={`${s.keep} ${savedPosts.includes(selectedPost?.id) ? s.keepActive : ''}`} />
                            </div>
                        </div>


                    </div>
                ))
            )}

        </div>
    );
};

export default ReviewPosts;
