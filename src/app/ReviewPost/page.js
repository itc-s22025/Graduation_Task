"use client";

import React, { useRef,useState } from "react";
import s from "./ReviewPost.module.css";
import MainLayout from "../../components/MainLayout";
import Tweet from "../../components/tweet";

const ReviewPost = () => {
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [productName, setProductName] = useState("");
    const [star, setStar] = useState("");
    const [review,setReview] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const inputRef = useRef(null);


    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`ブランド：${brand}\n商品名：${productName}`);
    };

    const handleLabelClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    return (
        <>
            <MainLayout>
                <h1 className={s.title}>レビュー投稿</h1>
                <Tweet />
            </MainLayout>
            <div className={s.box}>
                <div className={s.iconContainer}>
                    <img src={"/icon.jpeg"} className={s.icon} alt="User icon"/>
                </div>
                <p className={s.name}>{name || "name"}</p> {/* nameの部分にユーザー名を設定可能 */}

                <form onSubmit={handleSubmit}> {/* フォームの作成 */}
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
                        <label htmlFor="productName" className={s.label}> 商品名：</label>
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
                        <label htmlFor="star" className={s.label}> おすすめ度：</label>
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
                        <label htmlFor="review" className={s.label}> レビュー：</label>
                        <input
                            type="text"
                            id="review"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="入力してください"
                            className={s.inputField}
                        />
                    </div>
                </form>
                <label htmlFor="imageInput" onClick={handleLabelClick} >
                    <p className={s.smallbox}>＋</p>
                </label>

                <input
                    id="imageInput"
                    type="file"
                    ref={inputRef}
                    style={{display: 'none'}}
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                />
            </div>
        </>
    );
};

export default ReviewPost;
