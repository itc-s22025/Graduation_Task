import s from '@/styles/eachPost.module.css'

const EachPost = () => {
    return(
        <>
            <div className={s.allContainer}>

                <div className={s.postContainer}>
                    <div className={s.iconAndInfoContainer}>
                        <img className={s.icon} alt="icon"/>
                        <div className={s.infoContainer}>
                            <p className={s.userName}>UserName</p>
                            <p className={s.userID}>@user1</p>
                        </div>
                        <p className={s.date}>2024/10/10 08:22</p>
                    </div>
                    <p className={s.content}>あああああああああああああああああああああああああああああああああああああああああああああああああ</p>
                    <div className={s.reactionContainer}>
                        <div className={s.eachReactionContainer}>
                            <img alt="reply" src="/comment.png" className={s.reply}/>
                            <p className={s.reactionText}>0</p>
                        </div>
                        <div className={s.eachReactionContainer}>
                        <div className={s.repost}/>
                            <p className={s.reactionText}>0</p>
                        </div>
                        <div className={s.eachReactionContainer}>
                            <div className={s.like}/>
                            <p className={s.reactionText}>0</p>
                        </div>
                        <div className={s.eachReactionContainer}>
                            <div className={s.keep}/>
                            <p className={s.reactionText}>0</p>
                        </div>
                        <div className={s.share}/>
                    </div>
                    <div className={s.replyContentContainer}>
                        <img alt="icon" className={s.replyIcon} />
                        <textarea placeholder="post your reply..." className={s.replyContent} />
                        <button type="button" className={s.replyButton}>Reply</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EachPost