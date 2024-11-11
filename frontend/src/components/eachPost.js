import s from '@/styles/eachPost.module.css';

const EachPost = ({ post, currentUserUid }) => {
    if (!post) return null;

    const isLiked = post.likedBy && post.likedBy.includes(currentUserUid);
    const isReposted = post.repostedBy && post.repostedBy.includes(currentUserUid);

    return (
        <div className={s.allContainer}>
            <div className={s.postContainer}>
                <div className={s.iconAndInfoContainer}>
                    <img className={s.icon} src={post.userIcon || '/default-icon.png'} alt="User Icon" />
                    <div className={s.infoContainer}>
                        <p className={s.userName}>{post.name || "Anonymous"}</p>
                        <p className={s.userID}>@{post.userID || "user1"}</p>
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
                    <img src={post.userIcon || '/icon.jpeg'} alt="User Icon" className={s.replyIcon} />
                    <textarea placeholder="Post your reply..." className={s.replyContent} />
                    <button type="button" className={s.replyButton}>Reply</button>
                </div>
            </div>
        </div>
    );
};

export default EachPost;
