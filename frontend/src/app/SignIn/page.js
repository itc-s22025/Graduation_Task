"use client";

import FirstLayout from "@/components/FirstLayout";
import s from "./page.module.css"

import React, { useState } from 'react';
import { auth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {useRouter} from "next/navigation";

const SignIn = () => {
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // emailログイン
    const handleEmailLogin = async (event) => {
        event.preventDefault();

        try {
        await signInWithEmailAndPassword(auth, email, password);
        // alert('ログイン成功');
        router.push('/Home')
        } catch (error) {
        alert('ログインできませんでした')
        }
    };

    // Googleログイン
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            router.push('/Home');
        } catch (error) {
            alert('Googleログイン失敗: ' + error.message);
        }
    };

  return (
      <>
          <div className={s.allContainer}>
              <h1 className={s.logo}>♥Prettie</h1>
              <div className={s.MainContainer}>
                  <h1 className={s.title}>サインイン</h1>
                  <form onSubmit={handleEmailLogin} className={s.grid}>
                      <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="メールアドレス"
                          className={s.input}
                      />
                      <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="パスワード"
                          className={s.input}
                      />
                      <button type="button" className={s.forgotPwd}>パスワードをお忘れですか？</button>
                      <button type="submit" className={s.submit}>サインイン</button>
                  </form>

                  <p className={s.or}>または</p>
                  <button onClick={handleGoogleLogin} className={s.google}>Googleでサインイン</button>

                  <div className={s.signUpContainer}>
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      <p className={s.signUpText}>アカウントをお持ちでないですか？</p>
                      <button type="button" className={s.signUp} onClick={() => router.push('/SignUp')}>サインアップ</button>
                  </div>
                  {error && <p>{error}</p>}
              </div>
          </div>
      </>
  );
};

export default SignIn;
