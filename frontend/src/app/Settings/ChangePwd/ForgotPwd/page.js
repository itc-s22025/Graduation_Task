"use client";

import s from './forgot.module.css';
import {useState} from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";

const ForgotPwdPage = () => {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleNextClick = async (e) => {
        e.preventDefault(); // prevent default behavior
        if (!email) {
            alert("メールアドレスを入力してください。"); // handle empty input
            return;
        }

        router.push(`/Settings/ChangePwd/ForgotPwd/Authentication?email=${email}`);
    };

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <AccountHeader title="パスワードを忘れた方へ"/>

                    <div className={s.content}>

                        <div className={s.font}>
                            <h3>※アカウントに
                                関連付けられた電子メールを</h3>
                        </div>
                            <h3 className={s.font2}>入力してください</h3>
                        <input
                            type="email"
                            id="email"
                            className={s.input}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <button className={s.cancel} onClick={() => router.back()}>Cancel</button>
                        <button className={s.next} onClick={handleNextClick}>Next</button>
                    </div>
                </div>

            </MainLayout>
        </>
    );
};
export default ForgotPwdPage;