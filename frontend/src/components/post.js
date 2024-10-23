"use client";

import s from '@/styles/post.module.css'
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
            <div className={s.all}>
                <div className={s.flex}>
                    <p className={s.icon}/>
                    <div>
                        <div className={s.topContainer}>
                            <div className={s.infoContainer}>
                                <p className={s.name}>name</p>
                                <p className={s.userID}>@user1</p>
                                <p className={s.time}>.1h</p>
                                <p className={s.pc}>ブルベ</p>
                            </div>
                            <button type="button" className={s.editButton}>...</button>
                        </div>

                        <p className={s.content} onClick={handleEachPostClick}>text text text text <br/>
                            excelのプライマー欲し
                        </p>
                        <div className={s.reactionContainer}>
                            <div className={s.flex}>
                                <img src="/comment.png" className={s.reply} onClick={handleEachPostClick}/>
                                <p className={s.reactionText}>0</p>
                            </div>
                            <div className={s.flex}>
                                <div className={s.repost}/>
                                <p className={s.reactionText}>0</p>
                            </div>
                            <div className={s.flex}>
                                <div className={s.like}/>
                                <p className={s.reactionText}>0</p>
                            </div>
                            <div className={s.flex}>
                                <div className={s.keep}/>
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