'use client';

import s from './AcEdit.module.css';
import Leftbar_before_home from "@/components/leftbar_before_home";
import Rightbar_for_home from "@/components/rightbar_for_home";
import Image from "next/image";
import { useState } from "react";
import {EmailAuthProvider, getAuth, reauthenticateWithCredential} from "firebase/auth";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {error} from "next/dist/build/output/log";

const EditPage = () => {
    // const [password, setPassword] = useState('');
    const auth = getAuth();
    const user =auth.currentUser;
    const [currentPassword, setCurrentPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');

    const toggleConfirmPassword = (setter) => {
        setter(prevState => !prevState);
    };

    const handleNextClick = async (e) => {
        e.preventDefault();

        if (!currentPassword) {
            setError("パスワードを入力してください");
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            router.push(`/Settings/Info/Pass/UpDateInfo`);
        } catch (error) {
            console.error("Navigation failed:", error);
            }
        }


    return (
        <>
            <Leftbar_before_home />
            <h1 className={s.container}>
                パスワードの確認
            </h1>
            <div className={s.content}>
                {/*<div className={s.box}></div>*/}
                <h3 className={s.font}>※アカウント情報を変更したい場合は、先にパスワードの入力をしてください</h3>
                <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    id="password"
                    className={s.input}
                    placeholder="パスワードの入力"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Image
                    src='/eye.png'
                    alt="i"
                    width={10}
                    height={10}
                    className={s.img}
                    onClick={() => toggleConfirmPassword(setShowCurrentPassword)}
                    style={{ cursor: "pointer" }}
                    />
                {error && <p className={s.error}>{error}</p>}
                <button className={s.next} onClick={handleNextClick}>Next</button>
            </div>

            <Rightbar_for_home/>
        </>
    )
};
export default EditPage;