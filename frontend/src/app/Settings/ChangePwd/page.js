'use client';

import { getAuth, updatePassword } from "firebase/auth";
import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";
import s from "./pwd.module.css";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const Password = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);


    const handleSaveButton = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("新しいパスワードが一致しません");
            return;
        }

        try {
            if (user) {
                await updatePassword(user, newPassword);
                alert("パスワードが正常に更新されました。");
            } else {
                alert("ユーザーがログインしていません");
            }
        } catch (error) {
            console.error(error);
            alert("パスワードの更新に失敗しました: " + error.message);
        }
    };

    // const handleReauthentication = async (e) => {
    //     e.preventDefault();
    //
    //     try {
    //         const credential = EmailAuthProvider.credential(user.email, currentPassword);
    //         await reauthenticateWithCredential(user, credential);
    //         console.log("再認証成功");
    //     } catch (error) {
    //         console.error("再認証失敗:", error);
    //         alert("再認証に失敗しました。パスワードが正しいか確認してください。");
    //     }
    // };
    const toggleConfirmPassword = (setter) => {
        setter(prevState => !prevState);
    };

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <AccountHeader title="Password"/>
                    <div className={s.all}>
                        <h2>パスワードを変更してください</h2>
                        <div className={s.box}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="現在のパスワード"
                                className={s.text}
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
                        </div>
                        <Link href="/Settings/ChangePwd/ForgotPwd" className={s.color}>パスワードをお忘れですか？</Link>
                        <p className={s.border}>-------------------------------------------------------------------------------------------</p>
                        <div className={s.box}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="新しいパスワード"
                                className={s.text}
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
                        </div>
                        <div className={s.box}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="もう一度新しいパスワードを入力"
                                className={s.text}
                            />
                            <Image
                                src='/eye.png'
                                alt="i"
                                width={10}
                                height={10}
                                className={s.img}
                                onClick={() => toggleConfirmPassword(setShowConfirmPassword)}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                        <button onClick={handleSaveButton} className={s.save} type="button" id="saveButton">Save</button>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}

export default Password;