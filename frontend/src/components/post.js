"use client";

import s from '@/styles/post.module.css'
import {useState} from "react";
import EachPost from "@/components/eachPost";

const Post = () => {
    //state
    const [showEachPost, setShowEachPost] = useState(false);
    const [showEditMore, setShowEditMore] = useState(false);

    const handleEachPostClick = () => {
        setShowEachPost(true);
    };

    const handleEditButtonClick = () => {
        setShowEditMore(prev => !prev);
    };


    const handleCloseEachPost = () => {
        setShowEachPost(false);
    }

    return(
        <>
            <div className={s.allContainer}>
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
                                <button type="button" className={s.editButton} onClick={handleEditButtonClick}>…</button>
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

                {/*EditButton*/}
                {showEditMore && (
                    <div className={s.reportAllContainer}>
                        <button type="button" onClick={handleEditButtonClick} className={s.closeReportButton}/>
                        <div className={s.reportContainer}>
                            <button type="button" className={s.reportPostButton}>ポストを報告</button>
                            <button type="button" className={s.reportUserButton}>ユーザーを報告</button>
                        </div>
                    </div>
                )}

                {/*EachPostクリックしたとき*/}
                {showEachPost && (
                    <div className={s.eachPostContainer}>
                        <div className={s.headerContainer}>
                            <button type="button" className={s.backButton} onClick={handleCloseEachPost}>←</button>
                            <h1 className={s.headerTitle}>Post</h1>
                            <button type="button" className={s.closeEachPost} onClick={handleCloseEachPost}/>
                        </div>
                        <EachPost/>
                    </div>
                )}
            </div>

        </>
    )
}

export default Post