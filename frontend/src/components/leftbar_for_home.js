"use client";

import s from '../styles/leftbar_for_home.module.css';
import {usePathname, useRouter} from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

const LeftBar = () => {
    const router = useRouter();
    const pathname = usePathname()

    //ログアウト
    const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    }

    return(
        <>
            <div className={s.all}>
                <h1 className={s.logo}>♡Prettie</h1>
                <div className={s.button_container}>
                    <button className={`${s.button} ${ pathname === '/Home' ? s.active : '' }`} onClick={() => router.push('/Home')}>Home</button>
                    <button className={`${s.button} ${ pathname === '/Search' ? s.active : '' }`} onClick={() => router.push('/Search')}>Search</button>
                    <button className={`${s.button} ${ pathname === '/Profile' ? s.active : '' }`} onClick={() => router.push('/Profile')}>Profile</button>
                    <button className={`${s.button} ${ pathname === '/Notifications' ? s.active : '' }`} onClick={() => router.push('/')}>Notifications</button>
                    <button className={`${s.button} ${ pathname === '/Settings' ? s.active : '' }`} onClick={() => router.push('/Settings')}>Settings</button>
                    <button className={`${s.button} ${ pathname === '/Keeps' ? s.active : '' }`} onClick={() => router.push('/')}>Keeps</button>
                    <button className={`${s.button} ${ pathname === '/ColorDiagnosis' ? s.active : '' }`} onClick={() => router.push('/')}>Color Diagnosis</button>
                    <button className={`${s.button} ${ pathname === '/MyCosmetics' ? s.active : '' }`} onClick={() => router.push('/')}>My Cosmetics</button>
                    <button onClick={handleLogout}>logout</button>
                </div>
            </div>
        </>
    )
}

export default LeftBar