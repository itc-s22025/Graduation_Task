"use client";

import s from "../styles/Acheader.module.css"
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function AccountHeader({title}) {
    const router = useRouter();

    const handleBackButtonClick = () => {
        router.back()
        console.log("バックボタンクリック")
    }

    // useEffect(() => {
    //     let initialLoad = true;
    //     const handleNavigation = () => {
    //
    //         if (initialLoad) {
    //             initialLoad = false;
    //             return;
    //
    //         }
    //         router.back();
    //     };
    //
    //     window.addEventListener('popstate', handleNavigation);
    //
    //     return () => {
    //         window.removeEventListener('popstate', handleNavigation);
    //     };
    // }, [router]);

    return (
        <>
            <div className={s.bg}>
               <button type="button" className={s.yajirushi} onClick={handleBackButtonClick}>←</button>
               <h1 className={s.title}>{title}</h1>
            </div>
        </>
    )
}