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
                    setUserId(data.uid || 'userID');
                    setEmail(data.email || 'email メール');
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
                        <h3 className={s.box2}>{userId}</h3>

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

// 'use client';
//
// import AccountHeader from "@/components/AccountHeader";
// import MainLayout from "@/components/MainLayout";
// import s from "./info.module.css"
// import {useEffect, useState} from "react";
// import {useAuth} from "@/app/context/AuthProvider";
// import {doc, getDoc, getFirestore} from "firebase/firestore";
// import Link from "next/link";
//
// const Page = () => {
//     const [userData, setUserData] = useState(null);
//     const [email, setEmail] = useState("");
//     const [name, setName] = useState("");
//     // const [username, setUsername] = useState("");
//     const [userId, setUserId] = useState(null);
//     const auth = useAuth();
//     const db = getFirestore();
//     // const user = auth.currentUser;
//     // const uid = user ? user.uid : null;
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const user = auth.currentUser;
//                 if (user) {
//                     const docRef = doc(db, "users", user.uid);
//                     const docSnap = await getDoc(docRef);
//
//                     if (docSnap.exists()) {
//                         const data = docSnap.data();
//                         setUserData(data);
//
//                         setName(data.name)
//                         setEmail(data.email);
//                         setUserId(data.uid);
//
//
//                     }
//                 }
//         };
//         fetchUserData();
//     }, [auth, db]);
//
//     return (
//         <>
//             <MainLayout>
//                 <div className={s.allContainer}>
//                     <AccountHeader title="Account Information" />
//                     <div className={s.all}>
//
//                         <h2 className={s.font1}>UserName</h2>
//                         <h3 className={s.box}>{name}</h3>
//
//                         <h2 className={s.font3}>UserID</h2>
//                         <h3 className={s.box3}>{userId}</h3>
//
//                         <h2 className={s.font2}>Email-Address</h2>
//                         <h3 className={s.box2}>{email}</h3>
//
//                         <Link href="/Settings/Info/Pass">
//                             <button className={s.edit}>Edit</button>
//                         </Link>
//                     </div>
//                 </div>
//             </MainLayout>
//         </>
//     )
// }
// export default Page;