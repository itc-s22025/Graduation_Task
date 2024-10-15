"use client";

import React, {useState, useRef} from "react";
import Tweet from "../../components/tweet";
import MainLayout from "../../components/MainLayout";
import s from "./Post.module.css";

const Post = () => {
    const [tweet, setTweet] = useState('');
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef(null);

    const handleTweetChange = (event) => {
        const inputText = event.target.value;
        const maxLength = 100;
        if (inputText.length <= maxLength) {
            setTweet(inputText);
        }
    };

    const handleLabelClick = () => {
        if (inputRef.current) {
            inputRef.current.click();  
        }
    };

    const handlesubmit = () => {
        setTweet('');
    }

    return (
        <>
            <MainLayout>
                <h1 className={s.title}>Post</h1>
                <Tweet/>
            </MainLayout>
            <div className={s.box}>
                <div className={s.flex}>
                    {/* アイコン部分 */}
                    <div className={s.iconContainer}>
                        <img src="/icon.jpeg" className={s.icon} alt="User icon"/>
                    </div>
                    <p className={s.name}>{name || "name"}</p> {/* nameの部分にユーザー名を設定可能 */}
                    <textarea
                        className={s.textarea}
                        placeholder="Type today's muscle..."
                        value={tweet}
                        onChange={handleTweetChange}
                    />
                </div>
                <div className={s.iconWrapper}>
                    <label htmlFor="imageInput" className={s.iconLabel} onClick={handleLabelClick}>
                        <img src="/pic.jpeg" className={s.iconImg} alt="Select image"/>
                    </label>
                    <img src="/comments.jpeg" className={s.iconImg} alt="Comments"/>
                    <img src="/data.jpeg" className={s.iconImg} alt="Comments"/>
                    <button className={s.post} onClick={handlesubmit}>  P o s t  </button>
                    <input
                        id="imageInput"
                        type="file"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                </div>
            </div>
        </>
    );
}

export default Post;
