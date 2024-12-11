"use client";

import s from '../styles/leftbar_for_home.module.css';
import {usePathname, useRouter} from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

const LeftBar = () => {
    const router = useRouter();
    const pathname = usePathname()

     // 現在ログインしているユーザーの userId を取得
    const userId = auth.currentUser?.uid;

    //ログアウト
    const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    }

    return(
        <>
            <div className={s.all}>
                <div className={s.logosContainer}>
                    <h1 className={s.logo}>♡Prettie</h1>
                    <div className={s.button_container}>
                        <button className={`${s.button} ${pathname === '/Home' ? s.active : ''}`} onClick={() => router.push('/Home')}>Home</button>
                        <button className={`${s.button} ${pathname === '/Search' ? s.active : ''}`} onClick={() => router.push('/Search')}>Search</button>
                        {/*<button className={`${s.button} ${pathname === '/Profile' ? s.active : ''}`} onClick={() => router.push('/Profile')}>Profile</button>*/}
                        <button className={`${s.button} ${pathname === `/Profile/${userId}` ? s.active : ''}`} onClick={() => router.push(`/Profile/${userId}`)}>Profile</button>
                        <button className={`${s.button} ${pathname === '/Notifications' ? s.active : ''}`} onClick={() => router.push('/Notifications')}>Notifications</button>
                        <button className={`${s.button} ${pathname === '/Settings' ? s.active : ''}`} onClick={() => router.push('/Settings')}>Settings</button>
                        <button className={`${s.button} ${pathname === '/Keeps' ? s.active : ''}`} onClick={() => router.push('/Keeps')}>Keeps</button>
                        <button className={`${s.button} ${pathname === '/ColorDiagnosis' ? s.active : ''}`} onClick={() => router.push('/ColorDiagnosis')}>Color Analytics</button>
                        <button className={`${s.button} ${pathname === '/MyCosmetics' ? s.active : ''}`} onClick={() => router.push('/MyCosmetics')}>My Cosmetics</button>
                        <button className={s.logout} onClick={handleLogout}>logout</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftBar