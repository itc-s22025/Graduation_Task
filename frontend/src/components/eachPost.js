import { db } from '@/firebase';  // Firestoreのインポート
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import s from "@/styles/eachPost.module.css"

const EachPost = ({ post, currentUserUid }) => {
    console.log("カレントユーザ：", currentUserUid);

    const [userIcon, setUserIcon] = useState(null);

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

    if (!post) return null;

    const isLiked = post.likedBy && post.likedBy.includes(currentUserUid);
    const isReposted = post.repostedBy && post.repostedBy.includes(currentUserUid);

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
                    <textarea placeholder="Post your reply..." className={s.replyContent}/>
                    <button type="button" className={s.replyButton}>Reply</button>
                </div>
            </div>
        </div>
    );
};

export default EachPost;
