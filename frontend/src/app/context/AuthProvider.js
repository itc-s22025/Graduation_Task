"use client";

import React, { useEffect, useState, createContext, useContext } from 'react';
import { auth } from "@/firebase";
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // ローディング状態を追加

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user); // デバッグログ
      setCurrentUser(user);
      setLoading(false); // 認証状態が確定したらローディングを終了
    });

    return () => unsubscribe();
  }, []);

  return (
      <AuthContext.Provider value={{ currentUser, loading }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// "use client";
//
// import React, { useEffect, useState, createContext, useContext } from 'react';
// import { auth } from "@/firebase";
// import { onAuthStateChanged, getAuth } from 'firebase/auth';
//
// const AuthContext = createContext(null);
//
// export const AuthProvider = ({ children }) => {
//
//   //state
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true); // ローディング状態を追加
//
//   const [user, setUser] = useState(null);
//   const auth = getAuth();
//
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       console.log("Auth state changed:", user); // デバッグログ
//       setCurrentUser(user);
//       setLoading(false); // 認証状態が確定したらローディングを終了
//     });
//
//     return () => unsubscribe();
//   }, []);
//
//   return (
//     <AuthContext.Provider value={{ currentUser, loading, user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
//
// export const useAuth = () => useContext(AuthContext);
