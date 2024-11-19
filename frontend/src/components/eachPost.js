import { db } from '@/firebase';  // Firestoreのインポート
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import s from "@/styles/eachPost.module.css";

const EachPost = ({ post, currentUserUid }) => {
    const [userIcon, setUserIcon] = useState(null);
    const [replyContent, setReplyContent] = useState("");  // リプライ内容を保持するステート
    const [replies, setReplies] = useState([]);

    // Firebaseからユーザーアイコンを取得
    useEffect(() => {
        const getUserIcon = async () => {
            try {
                const userRef = doc(db, "users", currentUserUid);  // ユーザーのドキュメントを参照
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUserIcon(userDoc.data().icon);  // アイコンのURLをセット
                } else {
                    setUserIcon('/default-icon.png');  // ユーザーが存在しない場合、デフォルトアイコンを表示
                }
            } catch (error) {
                console.error("ユーザーアイコンの取得に失敗しました:", error);
                setUserIcon('/default-icon.png');  // エラー時もデフォルトアイコンを表示
            }
        };

        if (currentUserUid) {
            getUserIcon();
        }
    }, [currentUserUid]);  // currentUserUidが変わった時に再取得

    // リプライをFirestoreから取得
    useEffect(() => {
        const getReplies = async () => {
            if (post.repliedCount) {
                // リプライ元のポストIDを基にリプライを検索
                const q = query(collection(db, "posts"), where("replyTo", "==", post.id));
                const querySnapshot = await getDocs(q);
                const repliesData = querySnapshot.docs.map(doc => doc.data());

                setReplies(repliesData); // リプライをステートにセット
            }
        };

        getReplies();
    }, [post.id]);  // post.idが変更される度にリプライを取得

    if (!post) return null;

    const isLiked = post.likedBy && post.likedBy.includes(currentUserUid);
    const isReposted = post.repostedBy && post.repostedBy.includes(currentUserUid);

    // リプライの送信処理
    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;  // リプライ内容が空でないか確認

        try {
            // Firestoreにリプライを追加
            const newReply = {
                tweet: replyContent,
                uid: currentUserUid,
                name: post.name || "Anonymous",
                icon: userIcon || '/default-icon.png',
                timestamp: new Date(),
                replyTo: post.id,  // リプライ先のポストID
                likesCount: 0,
                likedUsers: [],
            };

            // リプライを投稿として保存
            const replyDocRef = await addDoc(collection(db, "posts"), newReply);

            // 返信されたポストの`repliedCount`を更新
            const postRef = doc(db, "posts", post.id);
            await updateDoc(postRef, {
                repliedCount: arrayUnion(replyDocRef.id),  // リプライされたポストの`repliedCount`にリプライIDを追加
            });

            // リプライ送信後に内容をリセット
            setReplyContent("");
        } catch (error) {
            console.error("リプライの送信に失敗しました:", error);
        }
    };

    return (
        <div className={s.allContainer}>
            <div className={s.postContainer}>
                <div className={s.iconAndInfoContainer}>
                    <div className={s.iconContainer}>
                        <img className={s.icon} src={post.icon} alt="User Icon"/>
                    </div>
                    <div className={s.infoContainer}>
                        <p className={s.userName}>{post.name || "Anonymous"}</p>
                        <p className={s.userID}>@{post.userId || "user1"}</p>
                    </div>
                    <p className={s.date}>{post.timestamp ? post.timestamp.toDate().toLocaleString() : "Date not available"}</p>
                </div>

                <p className={s.content}>{post.tweet}</p>

                {post.imageUrl && (
                    <img src={post.imageUrl} alt="Post Image" className={s.postImage} />
                )}

                <div className={s.reactionContainer}>
                    <div className={s.eachReactionContainer}>
                        <img alt="reply" src="/comment.png" className={s.reply}/>
                        <p className={s.reactionText}>0</p>
                    </div>
                    <div className={s.eachReactionContainer}>
                        <img alt="repost" src={isReposted ? "/repost_after.png" : "/repost_before.png"} className={s.repost}/>
                        <p className={s.reactionText}>{post.repostedBy ? post.repostedBy.length : 0}</p>
                    </div>
                    <div className={s.eachReactionContainer}>
                        <img alt="like" src={isLiked ? "/cutie_heart_after.png" : "/cutie_heart_before.png"} className={s.like} />
                        <p className={s.reactionText}>{post.likedBy ? post.likedBy.length : 0}</p>
                    </div>
                    <div className={s.eachReactionContainer}>
                        <div className={s.keep}/>
                        <p className={s.reactionText}>0</p>
                    </div>
                    <div className={s.share}/>
                </div>

                <div className={s.replyContentContainer}>
                    <div className={s.replyIconContainer}>
                        <img src={userIcon || '/user_default.png'} alt="icon" className={s.replyIcon}/>
                    </div>
                    <textarea
                        placeholder="Post your reply..."
                        className={s.replyContent}
                        value={replyContent}  // textareaに現在のリプライ内容をバインディング
                        onChange={(e) => setReplyContent(e.target.value)} // 入力された内容を更新
                    />
                    <button type="button" className={s.replyButton} onClick={handleReplySubmit}>Reply</button>
                </div>

                {/* リプライ表示部分 */}
                {replies.length > 0 && (
                    <div className={s.repliesContainer}>
                        {replies.map((reply, index) => (
                            <div key={index} className={s.replyPost}>

                                <div className={s.replyTopContainer}>
                                    <div className={s.replyIconContainer}>
                                        <img className={s.replyIcon} src={reply.icon} alt="User Icon"/>
                                    </div>
                                    <div className={s.replyUserInfoContainer}>
                                        <p className={s.replyName}>{reply.name || "Anonymous"}</p>
                                        <p className={s.replyUserId}>@{reply.userId || "user1"}</p>
                                    </div>
                                    <p className={s.replyDate}>{reply.timestamp ? reply.timestamp.toDate().toLocaleString() : "Date not available"}</p>
                                </div>

                                <div>
                                    <p className={s.repliedContent}>{reply.tweet}</p>

                                    <div className={s.replyReactionContainer}>
                                        <div className={s.eachReactionContainer}>
                                            <img alt="reply" src="/comment.png" className={s.reply}/>
                                            <p className={s.reactionText}>0</p>
                                        </div>
                                        <div className={s.eachReactionContainer}>
                                            <img alt="repost"
                                                 src={isReposted ? "/repost_after.png" : "/repost_before.png"}
                                                 className={s.repost}/>
                                            <p className={s.reactionText}>{reply.repostedBy ? reply.repostedBy.length : 0}</p>
                                        </div>
                                        <div className={s.eachReactionContainer}>
                                            <img alt="like"
                                                 src={isLiked ? "/cutie_heart_after.png" : "/cutie_heart_before.png"}
                                                 className={s.like}/>
                                            <p className={s.reactionText}>{reply.likedBy ? reply.likedBy.length : 0}</p>
                                        </div>
                                        <div className={s.eachReactionContainer}>
                                            <div className={s.keep}/>
                                            <p className={s.reactionText}>0</p>
                                        </div>
                                        <div className={s.share}/>
                                    </div>
                                </div>

                                {reply.imageUrl && (
                                    <img src={reply.imageUrl} alt="Post Image" className={s.postImage}/>
                                )}

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default EachPost;
