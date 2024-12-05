'use client';

import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";
import s from "./pwd.module.css";
import Link from "next/link";
import { useState } from "react";

const Password = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // パスワード表示トグル状態を個別に管理
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    const handleSaveButton = async (e) => {
        e.preventDefault();

        console.log("現在のユーザー情報:", user);
        if (!user) {
            alert("ユーザーがログインしていません。再度ログインしてください。");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("新しいパスワードが一致しません");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            console.log("再認証成功");

            await updatePassword(user, newPassword);
            alert("パスワードが正常に更新されました。");
        } catch (error) {
            console.error("エラー:", error);

            if (error.code === "auth/wrong-password") {
                alert("現在のパスワードが間違っています。");
            } else if (error.code === "auth/user-mismatch") {
                alert("ユーザー情報が一致しません。再ログインしてください。");
            } else if (error.code === "auth/weak-password") {
                alert("新しいパスワードが弱すぎます。強力なパスワードを設定してください。");
            } else {
                alert("エラーが発生しました: " + error.message);
            }
        }
    };



    return (
        <MainLayout>
            <div className={s.allContainer}>
                <AccountHeader title="Password" />
                <div className={s.all}>
                    <h2>パスワードを変更してください</h2>
                    {/* 現在のパスワード */}
                    <div className={s.box}>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="現在のパスワード"
                            className={s.text}
                        />
                        <img
                            src='/eye.png'
                            alt="eye"
                            width={10}
                            height={10}
                            className={s.img}
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    <Link href="/Settings/ChangePwd/ForgotPwd" className={s.color}>
                        パスワードをお忘れですか？
                    </Link>
                    <p className={s.border}>
                        -------------------------------------------------------------------------------------------
                    </p>
                    {/* 新しいパスワード */}
                    <div className={s.box}>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="新しいパスワード"
                            className={s.text}
                        />
                        <img
                            src='/eye.png'
                            alt="eye"
                            width={10}
                            height={10}
                            className={s.img}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    {/* 確認用パスワード */}
                    <div className={s.box}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="もう一度新しいパスワードを入力"
                            className={s.text}
                        />
                        <img
                            src='/eye.png'
                            alt="eye"
                            width={10}
                            height={10}
                            className={s.img}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                    <button onClick={handleSaveButton} className={s.save} type="button" id="saveButton">
                        Save
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default Password;