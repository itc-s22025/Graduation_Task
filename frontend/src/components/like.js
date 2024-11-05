"use client";

import s from "../styles/Notification.module.css"

const Like = () => {
    return (
        <div className={s.box}>
            <img src="/ハート.png" className={s.image} />
            <p className={s.message}>○○○さんにいいねされました</p>
        </div>
    )
}