"use client";


import FirstLayout from "@/components/FirstLayout";
import s from "./page.module.css"

import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('ログイン成功');
    } catch (error) {
      alert('ログイン失敗')
      // setError(error.message);
    }
  };

  return (
      <>
          <FirstLayout >
              <div className={s.all}>
                  <h1 className={s.signIn}>サインイン</h1>
                  <form onSubmit={handleLogin} className={s.grid}>
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
                      <button type="submit" className={s.submit}>サインイン</button>
                  </form>
                  {error && <p>{error}</p>}
              </div>
      </FirstLayout>
    </>
  );
};

export default SignIn;
