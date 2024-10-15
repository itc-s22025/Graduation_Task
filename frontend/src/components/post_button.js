"use client";

import s from '../styles/post_button.module.css';
import { useRouter } from "next/navigation";
import {useState} from "react";

const PostButton = () => {
    const router = useRouter();
    const [isClicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(!isClicked);
    }

   return (
    <div className={s.buttonContainer}>
        <button className={isClicked ? `${s.buttonA} ${s.buttonAFocus}` : s.buttonA} onClick={handleClick}>+</button>
        <button className={s.buttonB} onClick={() => router.push('/Post')}>投稿</button>
        <button className={s.buttonC} onClick={() => router.push('/ReviewPost')}>レビュー</button>
    </div>
);

}

export default PostButton;
