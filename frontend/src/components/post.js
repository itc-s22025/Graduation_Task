"use client";

import s from '@/styles/post.module.css'
import acHeader from "@/styles/Acheader.module.css";
import {useState} from "react";
import EachPost from "@/components/eachPost";

const Post = () => {
    const [showEachPost, setShowEachPost] = useState(false);

    const handleEachPostClick = () => {
        setShowEachPost(true);
    };

    const handleCloseEachPost = () => {
        setShowEachPost(false);
    }

    return(
        <>
            <div className={s.all} onClick={handleEachPostClick}>
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

            {/*EachPostクリックしたとき*/}
            {showEachPost && (
                <div>
                    <div className={s.headerContainer}>
                        <button type="button" className={s.backButton} onClick={handleCloseEachPost}>←</button>
                        <h1 className={s.headerTitle}>Post</h1>
                        <button type="button" className={s.closeEachPost} onClick={handleCloseEachPost}/>
                    </div>
                    <EachPost/>
                </div>
            )}
        </>
    )
}

export default Post