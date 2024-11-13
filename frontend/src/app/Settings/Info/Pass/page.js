'use client';

import s from './AcEdit.module.css';
import Image from "next/image";
import { useState } from "react";
import {EmailAuthProvider, getAuth, reauthenticateWithCredential} from "firebase/auth";
import {useRouter} from "next/navigation";
import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";

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
            <MainLayout>
            <div className={s.container}>
                <AccountHeader title="パスワードの確認" />
            </div>
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

            </MainLayout>
        </>
    )
};
export default EditPage;