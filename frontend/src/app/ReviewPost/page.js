"use client";

import React, { useRef, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {addDoc, collection, doc, getDoc, serverTimestamp} from "firebase/firestore";
import {db, storage} from "@/firebase"; // Firebaseの設定ファイル
import { useRouter } from "next/navigation"; // useRouterをインポート
import s from "./ReviewPost.module.css";
import MainLayout from "../../components/MainLayout";
import Tweet from "../../components/tweet";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

const ReviewPost = () => {
    const router = useRouter(); // useRouterフックを初期化
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [displayId, setDisplayId] = useState("");
    const [personalColor, setPersonalColor] = useState("");
    const [icon, setIcon] = useState("/defaultIcon.jpeg"); // デフォルトアイコン
    const [brand, setBrand] = useState("");
    const [productName, setProductName] = useState("");
    const [star, setStar] = useState("");
    const [review, setReview] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setName(userData.name || "");
                    setUsername(userData.username || "");
                    setDisplayId(userData.displayId || "");
                    setPersonalColor(userData.personalColor || "");
                    setIcon(userData.icon || "/defaultIcon.jpeg");
                }
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!review.trim() && !selectedImage) {
            alert("レビューまたは画像を入力してください。");
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error("ユーザーがサインインしていません");
                alert("ログインしてください。");
                return;
            }

            // 画像のアップロード
            let imageUrl = null;
            if (selectedImage) {
                const imageRef = ref(storage, `reviewImages/${selectedImage.name}`);
                await uploadBytes(imageRef, selectedImage);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Firestoreに投稿を保存
            const docRef = await addDoc(collection(db, "ReviewPosts"), {
                name,
                username,
                displayId,
                brand,
                productName,
                star,
                review,
                imageUrl, // アップロードした画像のURL
                timestamp: serverTimestamp(),
                uid: user.uid, // 現在のユーザーのID
            });

            console.log("投稿が保存されました。ドキュメントID:", docRef.id);
            alert("レビューが投稿されました！");

            // 投稿後にフォームをリセット
            setBrand("");
            setProductName("");
            setStar("");
            setReview("");
            setSelectedImage(null);

            // Home画面に遷移
            router.push("/Home");
        } catch (error) {
            console.error("レビューの投稿に失敗しました:", error);
            alert("投稿に失敗しました。もう一度お試しください。");
        }
    };


    const handleLabelClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <>
            <MainLayout>
                <h1 className={s.title}>レビュー投稿</h1>
                <Tweet />
            </MainLayout>
            <div className={s.box}>
                <div className={s.iconContainer}>
                    <img src={icon} className={s.icon} alt="User icon"/>
                </div>
                <p className={s.name} style={{ color: personalColor }}>
                    {name} <span className={s.username}>@{displayId}</span> {/* usernameをnameの横に表示 */}
                </p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="brand" className={s.label}>ブランド：</label>
                        <input
                            type="text"
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            placeholder="ブランドを入力してください"
                            className={s.inputField}
                        />
                    </div>
                    <div>
                        <label htmlFor="productName" className={s.label}>商品名：</label>
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="商品名を入力してください"
                            className={s.inputField}
                        />
                    </div>
                    <div>
                        <label htmlFor="star" className={s.label}>おすすめ度：</label>
                        <input
                            type="text"
                            id="star"
                            value={star}
                            onChange={(e) => setStar(e.target.value)}
                            placeholder="☆☆☆☆☆"
                            className={s.inputField}
                        />
                    </div>
                    <div>
                        <label htmlFor="review" className={s.label}>レビュー：</label>
                        <input
                            type="text"
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="入力してください"
                            className={s.inputField}
                        />
                    </div>
                    <label htmlFor="imageInput" onClick={handleLabelClick}>
                        <p className={s.smallbox}>＋</p>
                    </label>
                    <input
                        id="imageInput"
                        type="file"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <button type="submit" className={s.post}>POST</button>
                </form>
            </div>
        </>
    );
};

export default ReviewPost;
