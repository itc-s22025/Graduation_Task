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
        return signInWithPopup(auth, provider);
    } catch (error) {
      alert('Googleログイン失敗: ' + error.message);
    }
  };

  return (
      <>
          <div className={s.allContainer}>
              <h1 className={s.logo}>♥Prettie</h1>
              <div className={s.MainContainer}>
                  <h1 className={s.title}>Sign in</h1>
                  <form onSubmit={handleEmailLogin} className={s.grid}>
                      <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className={s.input}
                      />
                      <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className={s.input}
                      />
                      <button type="button" className={s.forgotPwd}>Forgot your password?</button>
                      <button type="submit" className={s.submit}>Sign in</button>
                  </form>

                  <p className={s.or}>OR</p>
                  <button onClick={handleGoogleLogin} className={s.google}>Sign in with Google</button>

                  <div className={s.signUpContainer}>
                      {/* eslint-disable-next-line react/no-unescaped-entities */}
                      <p className={s.signUpText}>Don't have an account yet?</p>
                      <button type="button" className={s.signUp} onClick={() => router.push('/SignUp')}>Sign up now</button>
                  </div>
                  {error && <p>{error}</p>}
              </div>
          </div>
      </>
  );
};

export default SignIn;
