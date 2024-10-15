"use client";

import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import s from './detail.module.css';
import {useRouter} from "next/navigation";

const Detail = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //追加でfirestoreに登録するやつ
  const [name, setName] = useState('');
  const [personalColor, setPersonalColor] = useState('');
  const [bio, setBio] = useState('');

  const [error, setError] = useState(null);

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestoreにユーザー情報を保存
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        email,
        personalColor,
        bio
      });

      alert('User created successfully');
      await router.push('/');

      setEmail('');
      setPassword('');
      setName('');
      setPersonalColor('');
      setBio('')
    } catch (error) {
      setError(error.message);
    }
  };

  return (
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
            <label htmlFor="personalColor" className={s.label}>パーソナルカラー</label>
              <select name="personalColor" value={personalColor} onChange={(e) => setPersonalColor(e.target.value)} className={s.inputBox} required>
                <option value="">選択してください</option>
                <option value="イエベ春">イエベ春</option>
                <option value="ブルベ夏">ブルベ夏</option>
                <option value="イエベ秋">イエベ秋</option>
                <option value="ブルベ冬">ブルベ冬</option>
              </select>
          </div>

          <button type="button" className={s.pcText}>診断してみる</button>

          <div className={s.inputContainer}>
            <label htmlFor="email" className={s.label}>メールアドレス</label>
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={s.inputBox}
                placeholder="E-mail"
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
            />
          </div>

          <button type="submit" className={s.submit}>サインアップ</button>
        </form>

        {error && <p>{error}</p>}
      </div>
  );
};

export default Detail;
