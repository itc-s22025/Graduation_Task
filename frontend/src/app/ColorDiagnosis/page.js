"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase"; // Firebaseの設定をインポート
import { doc, getDoc } from "firebase/firestore";
import MainLayout from "@/components/MainLayout";
import { Spring, Summer, Autumn, Winter } from "@/components/pcResult";
import ColorAnalyze from "@/components/colorAnalyze";
import LoadingPage from "@/components/loadingPage";

const ColorDiagnosis = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // ログイン状態
    const [personalColor, setPersonalColor] = useState(""); // personalColorの状態

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        setPersonalColor(userDoc.data().personalColor || ""); // personalColorを取得
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setIsLoggedIn(false);
                setPersonalColor(""); // ログアウト時に状態をリセット
            }
        });

        return () => unsubscribe();
    }, []);

    if (isLoggedIn === null) {
        return <LoadingPage/>; // ログイン状態が確認されるまでローディング
    }

    if (!isLoggedIn) {
        return <ColorAnalyze />; // ログインしていない場合に <ColorAnalyze /> を表示
    }

    // personalColorに基づいて表示するコンポーネントを決定
    const renderPersonalColorComponent = () => {
        switch (personalColor) {
            case "イエベ春":
                return <Spring />;
            case "ブルベ夏":
                return <Summer />;
            case "イエベ秋":
                return <Autumn />;
            case "ブルベ冬":
                return <Winter />;
            default:
                return <div>お客様のパーソナルカラーが設定されていません。</div>;
        }
    };

    return (
        <MainLayout>
            {renderPersonalColorComponent()}
        </MainLayout>
    );
};

export default ColorDiagnosis;
