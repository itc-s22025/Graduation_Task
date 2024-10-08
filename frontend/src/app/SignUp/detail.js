"use client";

import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import s from './detail.module.css';

const Detail = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //追加でfirestoreに登録するやつ
  const [name, setName] = useState('');
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
      });

      alert('User created successfully');

      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
      <div className={s.all}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
          />
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
          />
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
          />
          <button type="submit">Sign Up</button>
        </form>
        {error && <p>{error}</p>}
      </div>
  );
};

export default Detail;
