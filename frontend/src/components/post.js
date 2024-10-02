import s from '@/styles/post.module.css'

const Post = () => {
    return(
        <>
            <div className={s.all}>
                <div className={s.flex}>
                    <p className={s.icon}/>
                    <div>
                        <div className={s.flex}>
                            <p className={s.name}>name</p>
                            <p className={s.userID}>@user1</p>
                            <p className={s.time}>.1h</p>
                            <p className={s.pc}>ブルベ</p>
                        </div>
                        <p className={s.content}>text text text text    <br/>
                            excelのプライマー欲し〜
                        </p>
                        <div className={s.flex}>
                            <div className={s.flex}>
                                <p className={s.reply}/>
                                <p>0</p>
                            </div>
                            <div className={s.flex}>
                                <p className={s.repost}>⇄</p>
                                <p>0</p>
                            </div>
                            <div className={s.flex}>
                                <p className={s.like}>♡</p>
                                <p>0</p>
                            </div>
                            <div className={s.flex}>
                                <p className={s.save}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Post