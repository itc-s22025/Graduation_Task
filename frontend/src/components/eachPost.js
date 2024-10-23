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
                        <img alt="reply" src="/comment.png" className={s.reply}/>
                        <img alt="repost" src="/repost_before.png" className={s.repost}/>
                        <img alt="like" src="/cutie_heart.png" className={s.like}/>
                        <img alt="save" src="/keep_before.png" className={s.save}/>
                        <img alt="share" src="/share.png" className={s.share}/>
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