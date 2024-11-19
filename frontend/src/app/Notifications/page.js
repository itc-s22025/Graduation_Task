"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";
import { useRouter } from "next/navigation";
import NotificationsTab from "@/components/NotificationsTab";
import EachPost from "@/components/eachPost";

const Notifications = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [showEachPost, setShowEachPost] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const router = useRouter();

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
                <NotificationsTab />
                <h1 className={s.title}>通知</h1>
                {notifications.map(notification => (
                    <div className={s.box} onClick={() => handleEachPostClick(notification)} key={notification.id}>
                        <div className={s.naiyou}>
                            <img src="/iine.png" className={s.iine} alt="いいねアイコン" />
                            {notification.icon && (
                                <img src={notification.icon} className={s.icon} alt="通知アイコン" onClick={() => router.push(`/AnotherScreen/${notification.uid}`)}/>
                            )}
                            <p>{notification.message}</p>
                            {notification.tweet && (
                                <p className={s.tweet}>{notification.tweet}</p>
                            )}
                        </div>
                    </div>
                ))}

                {/* リツイートの通知ボックス */}
                {notifications.map(notification => (
                    <div className={s.box} key={`${notification.id}-retweet`}>
                        <div className={s.naiyou}>
                            <img src="/retweet.jpeg" className={s.retweet} alt="リツイートアイコン" />
                            {notification.icon && (
                                <img src={notification.icon} className={s.icon} alt="通知アイコン" onClick={() => router.push(`/AnotherScreen/${notification.uid}`)}/>
                            )}
                            <p>{notification.message}</p>
                            {notification.tweet && (
                                <p className={s.tweet}>{notification.tweet}</p>
                            )}
                        </div>
                    </div>
                ))}
            </MainLayout>
        </div>
    );
};

export default Notifications;
