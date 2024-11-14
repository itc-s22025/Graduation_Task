'use client';

import s from "./AuthenCode.module.css";
import AccountHeader from "@/components/AccountHeader";
import Link from "next/link";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, deleteUser} from "firebase/auth";
import {useState} from "react";
import MainLayout from "@/components/MainLayout";

const AuthenticationCodePage = () => {
    const [password, setPassword] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;

    // パスワードの再認証処理
    const handleEnableClick = async () => {
        if (!password) {
            alert("パスワードを入力してください");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            setShowPopup(true); // 認証が成功したらポップアップを表示
        } catch (error) {
            alert("パスワードが間違っています。再確認してください。");
        }
    };

    // アカウント削除処理
    const handleDeleteAccount = async () => {
        try {
            await deleteUser(user);
            alert("アカウントが削除されました");
            setShowPopup(false);
        } catch (error) {
            alert("アカウント削除に失敗しました: " + error.message);
        }
    };

    // ポップアップのキャンセル
    const handleCancel = () => {
        setShowPopup(false);
    };

    return (
        <>
        <MainLayout>
            <div className={s.allContainer}>
                <AccountHeader title="Account delete"/>
                <div className={s.content}>
                    <h2 className={s.font}>パスワードを確認してください</h2>
                    <p className={s.font2}>・アカウントに関連付けられたパスワードを入力して、無効化をリクエストを完了します。</p>

                    <input
                        type="password"
                        className={s.input}
                        placeholder="パスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Link className={s.col}
                        href="/Settings/ChangePwd/ForgotPwd">
                        パスワードをお忘れですか？
                    </Link>

                    <button className={s.enable} onClick={handleEnableClick}>Enable</button>

                    {showPopup && (
                        <div className={s.popup}>
                            <div className={s.popupContent}>
                                <h3>アカウントを削除しますか？</h3>
                            <Link href="/">
                                <button onClick={handleDeleteAccount} className={s.deleteButton}>削除</button>
                            </Link>
                                <button onClick={handleCancel} className={s.cancelButton}>キャンセル</button>
                            </div>
                        </div>
                )}
                </div>
            </div>
        </MainLayout >
        </>
    )
}
export default AuthenticationCodePage;