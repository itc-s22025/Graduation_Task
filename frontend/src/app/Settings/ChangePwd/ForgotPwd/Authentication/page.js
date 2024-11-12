'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import s from './Authen.module.css';
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";

const AuthenticationCode = () => {
    const router = useRouter();
    const [email, setEmail] = useState(''); // Ensure setEmail is defined
    const [status, setStatus] = useState('');

    // Get email from query params
    useEffect(() => {
        const queryEmail = new URLSearchParams(window.location.search).get('email');
        if (queryEmail) {
            setEmail(queryEmail);
        }
    }, []);

    const handleSendClick = async () => {
        if (!email) {
            alert("Email is required.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setStatus("パスワードリセットされ、リンクがメールに送信されました");
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setStatus("Error sending email. Please try again.");
        }
    };

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <AccountHeader title="パスワードを忘れた方へ" />

                    <div className={s.container}>

                    <h3 className={s.font}>確認コードの送信</h3>
                    <div className={s.p}>
                        <p>次のメールアドレスに確認コードを送信します</p>
                        <p className={s.font2}>{email}</p>
                    </div>

                    <button onClick={handleSendClick} className={s.send}>Send</button>
                    {status && <p>{status}</p>}
                    <button className={s.cancel} onClick={() => router.back()}>Cancel</button>
                    </div>
                </div>
                </MainLayout>
            </>
    );
};

export default AuthenticationCode;