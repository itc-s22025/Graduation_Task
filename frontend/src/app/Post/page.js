"use client";

import React, { useState, useRef, useEffect } from "react";
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
    const [name, setName] = useState(""); // ユーザー名
    const [icon, setIcon] = useState(""); // ユーザーアイコン
    const [displayId, setDisplayId] = useState(""); // ディスプレイID
    const [selectedImage, setSelectedImage] = useState(null);
    const [pollVisible, setPollVisible] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [inMenuVisible, setInMenuVisible] = useState(false);
    const [menu, setMenu] = useState('');
    const [showQuestionBox, setShowQuestionBox] = useState(false); // 質問ボックスの表示状態
    const [question, setQuestion] = useState(""); // 質問内容
    const inputRef = useRef(null);


    // **ユーザー情報取得**
    useEffect(() => {
        const fetchUserData = async () => {
            const user = getAuth().currentUser;
            if (!user) {
                console.error("ユーザーがサインインしていません");
                return;
            }

            try {
                const usersCollection = collection(db, "users");
                const q = query(usersCollection, where("uid", "==", user.uid));
                const userSnapshot = await getDocs(q);

                if (!userSnapshot.empty) {
                    userSnapshot.forEach((doc) => {
                        setName(doc.data().name || "Anonymous"); // ユーザー名
                        setIcon(doc.data().icon || "/default_icon.png"); // アイコンURL
                        setDisplayId(doc.data().displayId || "unknown"); // ディスプレイID
                    });
                } else {
                    console.warn("ユーザードキュメントが存在しません");
                }
            } catch (error) {
                console.error("ユーザー情報の取得に失敗しました:", error);
            }
        };

        fetchUserData();
    }, []);

    // 投稿内容の変更
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

    const handleImageSelect = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setSelectedImage(files[0]);
        }
    };

    // 投稿送信
    const handleSubmit = async () => {
        // テキストが空でも画像が選択されていれば投稿できるように変更
        if (!tweet.trim() && !selectedImage) return; // テキストも画像もなければ送信しない

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

            // ユーザーデータの取得
            let userName = "Anonymous"; // デフォルトの名前
            let userIcon = "/user_default.png";
            let personalColor = "未設定";  //デフォルトのPC
            let displayId = "unknown";  // デフォルトのディスプレイID
            if (!userSnapshot.empty) {
                userSnapshot.forEach((doc) => {
                    userName = doc.data().name; // ユーザー名を取得
                    userIcon = doc.data().icon; // アイコン取得
                    personalColor = doc.data().personalColor;  // PCカラー
                    displayId = doc.data().displayId;  // displayIdを取得
                });
            }

            // 画像投稿関連
            let imageUrl = null;
            if (selectedImage) {
                const imageRef = ref(storage, `images/${selectedImage.name}`);
                await uploadBytes(imageRef, selectedImage);

                // アップロードした画像のURLを取得
                imageUrl = await getDownloadURL(imageRef);
            }

               // Firestoreに投稿を保存し、生成されたIDを取得
               const postDocRef = await addDoc(collection(db, "posts"), {
                  tweet,
                  uid: user.uid,    //自動生成されたuid格納
                  name: userName, // 取得したユーザー名を使用
                  icon: userIcon,   //取得したアイコン
                  personalColor: personalColor, //取得したPC
                  userId : displayId,  //取得したdisplayIDをuserIDとして表示
                  imageUrl: imageUrl || null,
                   pollOptions: pollVisible
                       ? pollOptions.filter(option => option.trim() !== "") // 空の選択肢を除外
                       : null,
                   pollResults: pollVisible
                       ? pollOptions.reduce((results, option) => {
                           if (option.trim() !== "") {
                               results[option] = 0; // 各選択肢の投票数を0で初期化
                           }
                           return results;
                       }, {})
                       : null,
                   question: question,
                  timestamp: serverTimestamp(),
                  replyTo: '',    //リプライのとき、リプライ先のポストIDを入れる
                  repliedCount: '', //投稿自体が持つリプライの数
                  likesCount: '',  //いいねの数
                  likedUsers: '',  //いいねしたユーザ
                  repostsCount: '',  //リポストの数
                  repostedUsers: '',  //リポストしたユーザ
                  keepsCount: '' //キープされた数
               });

            // 投稿後のリセット
            setTweet('');
            setSelectedImage(null);
            setPollVisible(false);
            setPollOptions(["", ""]);

            alert('投稿しました');

            // Home画面に遷移
            await router.push('/Home');
        } catch (error) {
            console.error("投稿の保存に失敗しました:", error);
        }
    };


    // 投票オプションの変更
    const handlePollOptionChange = (index, value) => {
        const updatedOptions = [...pollOptions];
        updatedOptions[index] = value;
        setPollOptions(updatedOptions);
    };

    // 投票オプションを追加
    const addOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, ""]);
        }
    };

    // 投票オプションを削除
    const removePollOption = (index) => {
        const updatedOptions = pollOptions.filter((_, i) => i !== index);
        setPollOptions(updatedOptions);
    };

    // 投票オプションの表示を削除
    const removePoll = () => {
        setPollVisible(false);
        setPollOptions(["", ""]);
    };

    // メニューの表示/非表示
    const toggleMenuVisibility = () => {
        setInMenuVisible(!inMenuVisible);
    };

    const handleQuestionClick = () => {
        setShowQuestionBox(true); // 質問ボックスを表示
    };



    return (
        <>
            <MainLayout>
                <h1 className={s.title}>Post</h1>
                <Tweet />
            </MainLayout>

            <div className={s.box}>
                <div className={s.flex}>
                    <div className={s.iconContainer}>

                        {selectedImage && (
                            <img src={URL.createObjectURL(selectedImage) || null} className={s.selectedImage} alt="Selected"/>
                        )}

                        <img src={icon || null} className={s.icon} alt="icon"/>

                    </div>
                    {/*<img src={icon} className={s.icon} alt="User icon"/>*/}
                    <p className={s.name}>{name || "name"}</p>
                    <p className={s.userId}> @{displayId || "unknown"}</p>
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
                        placeholder="今どうしてる？"
                        value={tweet}
                        onChange={handleTweetChange}
                    />
                </div>

                {selectedImage && (
                    <img
                        src={URL.createObjectURL(selectedImage) || null}
                        alt="Selected"
                        className={s.selectedImage}
                    />
                )}

                {pollVisible && (
                    <div className={s.survey}>
                        <div className={s.optionBox}>
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
                                        <button className={s.crossbutton}
                                                onClick={() => removePollOption(index)}>✕</button>
                                    )}
                                </div>
                            ))}
                            {pollOptions.length < 4 && (
                                <button className={s.addbutton} onClick={addOption}>＋</button>
                            )}
                            <p className={s.touhyou}>投票期間</p>
                            <div className={s.smallboxContainer}>
                                {/* 日の選択 */}
                                <select id="daySelect" className={s.smallbox}>
                                    {Array.from({ length: 6 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1} 日</option>
                                    ))}
                                </select>

                                {/* 時の選択 */}
                                <select id="hourSelect" className={s.smallbox}>
                                    {Array.from({ length: 23 }, (_, i) => (
                                        <option key={i} value={i}>{i}時間</option>
                                    ))}
                                </select>

                                {/* 分の選択 */}
                                <select id="minuteSelect" className={s.smallbox}>
                                    {Array.from({ length: 59 }, (_, i) => (
                                        <option key={i} value={i}>{i} 分</option>
                                    ))}
                                </select>
                            </div>

                            <button onClick={removePoll} className={s.removeButton}>アンケートを削除</button>
                        </div>
                    </div>
                )}

                {showQuestionBox && (
                    <div className={s.popup}>
                        <div className={s.textareaContainer}> {/* スタイルに変更 */}
                            <textarea
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="回答する"
                                className={s.textarea}
                            />
                            <button
                                onClick={() => setShowQuestionBox(false)}
                                className={s.cancelButton}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}


                <div className={s.iconWrapper}>
                <label className={s.iconLabel} onClick={handleLabelClick}>
                        <img src="/pic.jpeg" className={s.iconImg} alt="Select image" />
                    </label>

                    <img
                        src="/comments.jpeg"
                        className={s.iconImg}
                        alt="Comments"
                        onClick={handleQuestionClick}
                    />


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
                                style={{display: 'none'}}
                                onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    if (file) {
                                        setSelectedImage(file);
                                    }
                                }}
                            />
                        </div>
                        </div>
                        </>
                        );
                    };

export default Post;
