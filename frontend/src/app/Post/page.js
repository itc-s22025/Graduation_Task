"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Tweet from "../../components/tweet";
import MainLayout from "../../components/MainLayout";
import s from "./Post.module.css";
import { db, storage, auth } from "@/firebase";  // Firebase FirestoreとStorageをインポート
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Post = () => {
    const router = useRouter();

    const [tweet, setTweet] = useState('');
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [pollVisible, setPollVisible] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [inMenuVisible, setInMenuVisible] = useState(false);
    const [menu, setMenu] = useState('');
    const inputRef = useRef(null);

    const handleTweetChange = (event) => {
        // content 文字数制限100文字
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

    //post
    const handleSubmit = async () => {
    if (!tweet.trim()) return;

    try {
        const user = getAuth().currentUser;
        if (!user) {
            console.error("ユーザーがサインインしていません");
            return;
        }

        // usersコレクションから現在のユーザーのデータを取得
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("uid", "==", user.uid));
        const userSnapshot = await getDocs(q);

        let userName = "Anonymous"; // デフォルトの名前
        if (!userSnapshot.empty) {
            userSnapshot.forEach((doc) => {
                userName = doc.data().name; // ユーザー名を取得
            });
        }

        let imageUrl = null;

        // 画像が選択されている場合はStorageにアップロード
        if (selectedImage) {
            const imageRef = ref(storage, `images/${selectedImage.name}`);
            await uploadBytes(imageRef, selectedImage);
            imageUrl = await getDownloadURL(imageRef);
        }

        // Firestoreに投稿を保存し、生成されたIDを取得
        const postDocRef = await addDoc(collection(db, "posts"), {
            tweet,
            name: userName, // 取得したユーザー名を使用
            imageUrl: imageUrl,
            pollOptions: pollVisible ? pollOptions.filter(option => option.trim() !== "") : null,
            timestamp: serverTimestamp(),
            uid: user.uid,
            replyTo: '',    //リプライのとき、リプライ先のポストIDを入れる
            likesCount: '',  //いいねの数
            likedUsers: ''  //いいねしたユーザ
        });

        // 生成されたポストのIDを確認したいときはconsole見てね
        const postId = postDocRef.id;
        console.log("新しいポストのID:", postId);

        // 投稿後のリセット
        setTweet('');
        setSelectedImage(null);
        setPollVisible(false);
        setPollOptions(["", ""]);

        alert('投稿しました')
        // Home画面に遷移
        await router.push('/Home');
    } catch (error) {
        console.error("投稿の保存に失敗しました:", error);
    }
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
                <h1 className={s.title}>Post</h1>
                <Tweet/>
            </MainLayout>

            <div className={s.box}>
                <div className={s.flex}>
                    <div className={s.iconContainer}>
                        <img src="icon.jpeg" className={s.icon} alt="User icon"/>
                    </div>
                    <p className={s.name}>{name || "name"}</p>
                </div>

                {inMenuVisible && (
                    <div className={s.menu}>
                        <textarea
                            className={s.textarea}
                            placeholder="テキストを入力してください"
                            value={menu}
                            onChange={(e) => setMenu(e.target.value)}
                        />
                    </div>
                )}

                <div className={s.pollContainer}>
                    <textarea
                        className={s.textarea}
                        placeholder="テキストを入力してください"
                        value={tweet}
                        onChange={handleTweetChange}
                    />
                </div>

                {selectedImage && (
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className={s.selectedImage}
                    />
                )}

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
                        <img src="/pic.jpeg" className={s.iconImg} alt="Select image"/>
                    </label>

                    <img src="/comments.jpeg" className={s.iconImg} alt="Comments"/>
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
