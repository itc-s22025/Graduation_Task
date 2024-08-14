"use client";

import s from '../styles/post_button.module.css';
import { useRouter } from "next/navigation";

const PostButton = () => {
    const router = useRouter();

   return (
    <div className={s.buttonContainer}>
        <button className={s.buttonA}>+</button>
        <button className={s.buttonB} onClick={() => router.push('/')}>投稿</button>
        <button className={s.buttonC} onClick={() => router.push('/')}>レビュー</button>
    </div>
);

}

export default PostButton;
