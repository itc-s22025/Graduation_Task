"use client";

import s from "@/styles/leftbar_before_home.module.css"
import { useRouter } from 'next/navigation';

const LeftBarBeforeHome = ({title}) => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return(
        <>
            <div className={s.all}>
                <button className={s.button} onClick={handleBack}>←　戻る</button>
            </div>
        </>
    )
}

export default LeftBarBeforeHome;