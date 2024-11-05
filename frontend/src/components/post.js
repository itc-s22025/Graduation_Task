import { useEffect, useState } from "react";
import s from '@/styles/post.module.css';
import EachPost from "@/components/eachPost";
//firebase
import { auth, db } from "@/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [showEachPost, setShowEachPost] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [currentUserUid, setCurrentUserUid] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Firestoreからリアルタイムで投稿を取得
        const unsubscribe = onSnapshot(collection(db, "posts"), async (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                likedBy: [],
            }));

            // likes コレクションから各投稿に対するいいね情報を取得
            const likesSnapshot = await getDocs(collection(db, "likes"));
            const likesData = likesSnapshot.docs.map(doc => doc.data());

            // 各ポストに likedBy 情報を追加
            postsData.forEach(post => {
                post.likedBy = likesData
                    .filter(like => like.postId === post.id)
                    .map(like => like.userId);
            });

            setPosts(postsData);  // Firestoreから取得したデータをセット
        });
        return () => unsubscribe();
    }, []);

    const handleLikeClick = async (postId) => {
        const postIndex = posts.findIndex(post => post.id === postId);
        const post = posts[postIndex];
        const alreadyLiked = post.likedBy.includes(currentUserUid);

        try {
            if (alreadyLiked) {
                const likesQuery = query(
                    collection(db, "likes"),
                    where("postId", "==", postId),
                    where("userId", "==", currentUserUid)
                );
                const querySnapshot = await getDocs(likesQuery);
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                });

                setPosts(prevPosts => {
                    const updatedPosts = [...prevPosts];
                    updatedPosts[postIndex].likedBy = updatedPosts[postIndex].likedBy.filter(uid => uid !== currentUserUid);
                    return updatedPosts;
                });
            } else {
                if (!post.likedBy.includes(currentUserUid)) {
                    await addDoc(collection(db, "likes"), {
                        postId: postId,
                        userId: currentUserUid,
                        timestamp: new Date(),
                    });
                    setPosts(prevPosts => {
                        const updatedPosts = [...prevPosts];
                        if (!updatedPosts[postIndex].likedBy.includes(currentUserUid)) {
                            updatedPosts[postIndex].likedBy.push(currentUserUid);
                        }
                        return updatedPosts;
                    });
                }
            }
        } catch (error) {
            console.error("Error toggling like: ", error);
        }
    };

    // 表示関連
    // showEachPost
    const [selectedPost, setSelectedPost] = useState(null);
    const handleEachPostClick = (post) => {
        setSelectedPost(post);  // クリックした投稿のデータを設定
        setShowEachPost(true);  // `EachPost` を表示
    };

    const handleReportButtonClick = () => { setShowReport(prev => !prev); };
    const handleCloseEachPost = () => { setShowEachPost(false); };




    return (
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
                            <p className={s.content} onClick={() => handleEachPostClick(post)}>{post.tweet}</p>
                            {post.imageUrl && <img src={post.imageUrl} alt="投稿画像" className={s.image} />}
                            <div className={s.reactionContainer}>
                                <div className={s.flex}>
                                    <img alt="リプライアイコン" src="/comment.png" className={s.reply} onClick={handleEachPostClick}/>
                                    <p className={s.reactionText}>0</p>
                                </div>
                                <div className={s.flex}>
                                    <div className={s.repost}/>
                                    <p className={s.reactionText}>0</p>
                                </div>
                                <div className={s.flex}>
                                    <img
                                        alt="いいねアイコン"
                                        src={post.likedBy.includes(currentUserUid) ? "/cutie_heart_after.png" : "/cutie_heart_before.png"}
                                        className={s.like}
                                        onClick={() => handleLikeClick(post.id)}
                                    />
                                    <p className={s.reactionText}>{post.likedBy.length}</p> {/* いいねの数を表示 */}
                                </div>
                                <div className={s.flex}>
                                    <div className={s.keep}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/*ReportButton*/}
                {showReport && (
                    <div className={s.reportAllContainer}>
                        <button type="button" onClick={handleReportButtonClick} className={s.closeReportButton}/>
                        <div className={s.reportContainer}>
                            <button type="button" className={s.reportPostButton}>ポストを報告</button>
                            <button type="button" className={s.reportUserButton}>ユーザーを報告</button>
                        </div>
                    </div>
                )}

            {/*EachPostクリックしたとき*/}
            {showEachPost && selectedPost && (
                <div className={s.eachPostContainer}>
                    <div className={s.headerContainer}>
                        <button type="button" className={s.backButton} onClick={handleCloseEachPost}>←</button>
                        <h1 className={s.headerTitle}>Post</h1>
                        <button type="button" className={s.closeEachPost} onClick={handleCloseEachPost}/>
                    </div>
                    <EachPost post={selectedPost} /> {/* 選択された投稿データを渡す */}
                </div>
            )}

        </div>
    );
};

export default Post;
