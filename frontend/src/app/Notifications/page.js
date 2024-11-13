"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import post from "@/components/post";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "notifications"), orderBy("timestamp", "desc")),
            (snapshot) => {
                const notificationsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(notificationsData);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <MainLayout>
                <h1 className={s.title}>通知</h1>
                {notifications.map(notifications => (
                    <div className={s.box} key={notifications.id}>
                        <div className={s.naiyou}>
                            <img src="/iine.png" className={s.iine}/>
                            <p>{notifications.message}</p>
                            <p className={s.tweet}>{notifications.tweet}</p> {/* 投稿内容を表示 */}

                        </div>
                    </div>
                ))}
            </MainLayout>
        </div>
    );
};

export default Notifications;
