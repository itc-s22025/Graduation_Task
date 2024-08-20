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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Post