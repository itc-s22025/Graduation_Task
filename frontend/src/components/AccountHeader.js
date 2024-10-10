"use client";

import s from "../styles/Acheader.module.css"
import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function AccountHeader({title}) {

    const router = useRouter();

    useEffect(() => {
        let initialLoad = true;
        const handleNavigation = () => {

            if (initialLoad) {
                initialLoad = false;
                return;

            }
            router.back();
        };

        window.addEventListener('popstate', handleNavigation);

        return () => {
            window.removeEventListener('popstate', handleNavigation);
        };
    }, [router]);

    return (
        <div className={s.bg}>
            <h1 className={s.text}>{title}</h1>
            <div className={s.yajirushi} onClick={() => router.back()}>
                <span>←</span>
            </div>
        </div>
    )
}