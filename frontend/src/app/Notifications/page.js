'use client';

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import s from "./page.module.css";

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
            <h2 className={s.title}>通知</h2>
            {notifications.map(notification => (
                <div className={s.naiyou} key={notification.id}>
                    <p>{notification.message}</p>
                </div>
            ))}
            </MainLayout>
        </div>
    );
};

export default Notifications;
