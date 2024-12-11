"use client";

import React, { useState, Suspense } from 'react';
import s from './detail.module.css';

import { useRouter } from "next/navigation";

import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import LoadingPage from "@/components/loadingPage";

const Detail = ({ myPC }) => {
  const router = useRouter();

  // フォーム入力を管理するステート
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayId: '',
    name: '',
    icon: '/user_default.png',
    personalColor: myPC || '',
    bio: '',
  });

  const [error, setError] = useState(null);

  // フォームの値を更新
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { email, password, name, icon, personalColor, bio, displayId } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        icon,
        personalColor,
        bio,
        displayId,
      });

      alert('User created successfully');
      await router.push('/');

      // フォームをリセット
      setFormData({
        email: '',
        password: '',
        displayId: '',
        name: '',
        icon: '/user_default.png',
        personalColor: '',
        bio: '',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className={s.bgContainer}>
        <div className={s.allContainer}>
          <h1 className={s.title}>サインアップ</h1>

          <form onSubmit={handleSignUp} className={s.formContainer}>
            <div className={s.inputContainer}>
              <label htmlFor="name" className={s.label}>ユーザー名</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={s.inputBox}
                placeholder="Name"
                required
              />
            </div>

            <div className={s.inputContainer}>
              <label htmlFor="displayId" className={s.label}>ユーザーID</label>
              @
              <input
                type="text"
                name="displayId"
                value={formData.displayId}
                onChange={handleInputChange}
                className={s.uidInputBox}
                placeholder="ID"
                required
              />
            </div>

            <div className={s.inputContainer}>
              <label htmlFor="personalColor" className={s.label}>パーソナルカラー</label>
              <select
                name="personalColor"
                value={formData.personalColor}
                onChange={handleInputChange}
                className={s.inputBox}
                required
              >
                <option value="" disabled>選択してください</option>
                <option value="イエベ春" className={s.option}>イエベ春</option>
                <option value="ブルベ夏" className={s.option}>ブルベ夏</option>
                <option value="イエベ秋" className={s.option}>イエベ秋</option>
                <option value="ブルベ冬" className={s.option}>ブルベ冬</option>
              </select>
            </div>

            <button type="button" className={s.pcText} onClick={() => router.push('/ColorDiagnosis')}>
              診断してみる
            </button>

            <div className={s.inputContainer}>
              <label htmlFor="email" className={s.label}>メールアドレス</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={s.inputBox}
                placeholder="E-mail"
                autoComplete="email"
                required
              />
            </div>

            <div className={s.inputContainer}>
              <label htmlFor="password" className={s.label}>パスワード</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={s.inputBox}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className={s.submit}>サインアップ</button>
          </form>

          {error && <p className={s.error}>{error}</p>}
        </div>
      </div>
    </Suspense>
  );
};

export default Detail;
