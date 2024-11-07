'use client';

import AccountHeader from "@/components/AccountHeader";
import MainLayout from "@/components/MainLayout";
import s from "./info.module.css"
import {useEffect, useState} from "react";
import {useAuth} from "@/app/context/AuthProvider";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import Link from "next/link";

const Page = () => {
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const auth = useAuth();
    const db = getFirestore();
    const [displayId, setDisplayId] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);

                    setName(data.name || 'user ユーザー');
                    setUserId(data.id || 'userID');
                    setEmail(data.email || 'email メール');
                    setDisplayId(data.displayId || 'User ID');
                }
            }
        };
        fetchUserData();
    }, [auth, db]);

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <AccountHeader title="Account Information" />
                    <div className={s.all}>

                        <h2 className={s.font1}>UserName</h2>
                        <h3 className={s.box}>{name}</h3>

                        <h2 className={s.font2}>UserID</h2>
                        <h3 className={s.box2}>{displayId}</h3>

                        <h2 className={s.font3}>Email-Address</h2>
                        <h3 className={s.box3}>{email}</h3>

                        <Link href="/Settings/Info/Pass">
                            <button className={s.edit}>Edit</button>
                        </Link>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default Page;