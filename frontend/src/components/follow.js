"use client";

import s from "../styles/Notification.module.css";

const follow = () => {
    return (
    <div className={s.box}>
        <img src="/follow.jpeg" className={s.image}/>
        <p className={s.message}>○○○さんにフォローされました</p>
    </div>
    )
}

export default follow;