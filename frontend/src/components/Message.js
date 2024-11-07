"use client";

import s from "../styles/Message.module.css";

const Message = () => {
    return (
        <div>
            <div className={s.box}>
                <img src="/ハート.png" className={s.image} alt="Like icon"/>
                <p className={s.message}>○○○さんがあなたの投稿にいいねしました</p>
            </div>

            <div className={s.box}>
                <img src="/follow.jpeg" className={s.image} alt="Follow icon"/>
                <p className={s.message}>○○○さんにフォローされました</p>
            </div>

            <div className={s.box}>
                <img src="/retweet.jpeg" className={s.image} alt="Retweet icon"/>
                <p className={s.message}>○○○さんがあなたの投稿をリツイートしました</p>
            </div>
        </div>
    );
};

export default Message;
