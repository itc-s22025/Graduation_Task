"use client";

import s from './forgot.module.css';
import {useState} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPwdPage = () => {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleNextClick = async (e) => {
        e.preventDefault(); // prevent default behavior
        if (!email) {
            alert("Please enter your email address."); // handle empty input
            return;
        }

        router.push(`/Settings/ChangePwd/ForgotPwd/Authentication?email=${email}`);
    };

    return (
        <>
            <div className={s.container}>
                <Link href="/Settings" className={s.close}>
                    ✕
                </Link>
                <h2 className={s.font}>- パスワードを忘れた方へ -</h2>
                <div className={s.field}>
                    <p>アカウントに関連付けられた電子メール、電話番号、またはユーザー名を入力してください</p>
                </div>
                <input
                    type="email"
                    id="email"
                    className={s.input}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button className={s.next} onClick={handleNextClick}>Next</button>
            </div>
        </>
    );
};
export default ForgotPwdPage;