"use client";

import { useState } from 'react';
import Pc from "@/app/SignUp/personalColor";
import Detail from "@/app/SignUp/detail";
import FirstLayout from "@/components/FirstLayout";

const SignUp = () => {
    const [step, setStep] = useState(1); // ステップ管理
    const [personalColor, setPersonalColor] = useState(null); // 選択されたパーソナルカラー

    const handleNextStep = () => {
        if (personalColor) {
            setStep(2); // 次のステップへ
        } else {
            alert('パーソナルカラーを選択してください。');
        }
    };

    const handleSetPersonalColor = (color) => {
        setPersonalColor(color);
    };

    return (
        <>
            <FirstLayout>
                {step === 1 && <Pc onNext={handleNextStep} onSelectColor={handleSetPersonalColor} />} {/* personalColor.js を表示 */}
                {step === 2 && <Detail personalColor={personalColor} />} {/* detail.js を表示 */}
            </FirstLayout>
        </>
    );
};

export default SignUp;
