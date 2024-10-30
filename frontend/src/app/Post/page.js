"use client";

import React, { useState, useRef } from "react";
import Tweet from "../../components/tweet";
import MainLayout from "../../components/MainLayout";
import s from "./Post.module.css";
import {useRouter} from "next/navigation";

const Post = () => {
    const router = useRouter();
    const [tweet, setTweet] = useState('');
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [pollVisible, setPollVisible] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [inMenuVisible, setInMenuVisible] = useState(false); // メニューの表示/非表示用
    const [menu, setMenu] = useState(''); // メニューのテキスト用
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

    const handleSubmit = () => {
        setTweet('');
        setSelectedImage(null);
        setPollVisible(false);
        router.push('../Home')
    };

    const handlePollOptionChange = (index, value) => {
        const updatedOptions = [...pollOptions];
        updatedOptions[index] = value;
        setPollOptions(updatedOptions);
    };

    const addOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, ""]);
        }
    };

    const removePollOption = (index) => {
        const updatedOptions = pollOptions.filter((_, i) => i !== index);
        setPollOptions(updatedOptions);
    };

    const removePoll = () => {
        setPollVisible(false);
        setPollOptions(["", ""]);
    };

    const toggleMenuVisibility = () => {
        setInMenuVisible(!inMenuVisible);
    };

    return (
        <>
            <MainLayout>
                <h1 className={s.title}>投稿</h1>
                <Tweet />
            </MainLayout>

            <div className={s.box}>
                <div className={s.flex}>
                    <div className={s.iconContainer}>
                        <img src="icon.jpeg" className={s.icon} alt="User icon" />
                    </div>
                    <p className={s.name}>{name || "name"}</p>
                </div>

                {/* メニュー表示用のエリア */}
                {inMenuVisible && (
                    <div className={s.menu}>
                        <textarea
                            className={s.textarea}
                            placeholder="Training Menu..."
                            value={menu}
                            onChange={(e) => setMenu(e.target.value)}
                        />
                    </div>
                )}

                {/* テキストエリア */}
                <div className={s.pollContainer}>
                    <textarea
                        className={s.textarea}
                        placeholder="テキストを入力してください"
                        value={tweet}
                        onChange={handleTweetChange}
                    />
                </div>

                {/* 選択された画像の表示 */}
                {selectedImage && (
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className={s.selectedImage}
                    />
                )}

                {/* アンケート（投票） */}
                {pollVisible && (
                    <div className={s.survey}>
                        {pollOptions.map((option, index) => (
                            <div key={index} className={s.pollOption}>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                    placeholder={`選択肢 ${index + 1}`}
                                    className={s.inputField}
                                />
                                {pollOptions.length > 2 && (
                                    <button className={s.crossbutton} onClick={() => removePollOption(index)}>✕</button>
                                )}
                            </div>
                        ))}
                        {pollOptions.length < 4 && (
                            <button className={s.addbutton} onClick={addOption}>＋</button>
                        )}
                        <button onClick={removePoll} className={s.removeButton}>アンケートを削除</button>
                    </div>
                )}

                <div className={s.iconWrapper}>
                    <label htmlFor="imageInput" className={s.iconLabel} onClick={handleLabelClick}>
                        <img src="/pic.jpeg" className={s.iconImg} alt="Select image" />
                    </label>

                    <img src="/comments.jpeg" className={s.iconImg} alt="Comments" />
                    <img
                        src="/data.jpeg"
                        className={s.iconImg}
                        alt="Poll"
                        onClick={() => setPollVisible(!pollVisible)}
                    />
                    <button className={s.post} onClick={handleSubmit}>P o s t</button>
                    <input
                        id="imageInput"
                        type="file"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setSelectedImage(file);
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default Post;
