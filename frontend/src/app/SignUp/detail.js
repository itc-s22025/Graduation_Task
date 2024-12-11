"use client";

import React, {useState, useEffect, Suspense} from 'react';
import s from './detail.module.css';

import { useRouter } from "next/navigation";

import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {collection, setDoc, doc} from 'firebase/firestore';

const Detail = ({ myPC }) => {
  const router = useRouter();

  //firebase auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //追加でfirestoreに登録するやつ
  const [displayId, setDisplayId] = useState('')
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('/user_default.png');
  const [personalColor, setPersonalColor] = useState(myPC || ''); // myPCを初期値に設定
  const [bio, setBio] = useState('');

  const [error, setError] = useState(null);

    const handleSignUp = async (event) => {
      event.preventDefault();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, 'users', user.uid),{
        uid: user.uid,
        name,
        email,
        icon,
        personalColor,
        bio,
        displayId
      });

      alert('User created successfully');
      await router.push('/');

      setDisplayId('');
      setEmail('');
      setPassword('');
      setName('');
      setIcon('')
      setPersonalColor('');
      setBio('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className={s.bgContainer}>
          <div className={s.allContainer}>
            <h1 className={s.title}>サインアップ</h1>

            <form onSubmit={handleSignUp} className={s.formContainer}>
              <div className={s.inputContainer}>
                <label htmlFor="name" className={s.label}>ユーザー名</label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={s.inputBox}
                    placeholder="Name"
                />
              </div>

              <div className={s.inputContainer}>
                <label htmlFor="displayId" className={s.label}>ユーザーID</label>
                @
                <input
                    type="text"
                    name="displayId"
                    value={displayId}
                    onChange={(e) => setDisplayId(e.target.value)}
                    className={s.uidInputBox}
                    placeholder="ID"
                />
              </div>

              <div className={s.inputContainer}>
                <label htmlFor="personalColor" className={s.label}>パーソナルカラー</label>
                <select
                    name="personalColor"
                    value={personalColor}
                    onChange={(e) => setPersonalColor(e.target.value)}
                    className={s.inputBox} required
                >
                  <option value="" disabled>選択してください</option>
                  <option value="イエベ春" className={s.option}>イエベ春</option>
                  <option value="ブルベ夏" className={s.option}>ブルベ夏</option>
                  <option value="イエベ秋" className={s.option}>イエベ秋</option>
                  <option value="ブルベ冬" className={s.option}>ブルベ冬</option>
                </select>
              </div>

              <button type="button" className={s.pcText} onClick={() => router.push('/ColorDiagnosis')}>診断してみる
              </button>

              <div className={s.inputContainer}>
                <label htmlFor="email" className={s.label}>メールアドレス</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={s.inputBox}
                    placeholder="E-mail"
                    autoComplete="email"
                />
              </div>

              <div className={s.inputContainer}>
                <label htmlFor="password" className={s.label}>パスワード</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={s.inputBox}
                    placeholder="Password"
                    autoComplete="current-password"
                />
              </div>
              <button type="submit" className={s.submit}>サインアップ</button>
            </form>

            {error && <p>{error}</p>}
          </div>
        </div>
      </Suspense>
  );
};

export default Detail;