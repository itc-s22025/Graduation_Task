"use client";

import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
    const location = useLocation();
    const userAnswers = location.state?.userAnswers || [];

    const calculateResult = () => {
        let result = "";
        if (userAnswers.length === 4) {
            if (userAnswers[0] === "真っ黒か黒に近い焦げ茶でキラキラ" && userAnswers[1] === "はっきりしていてキリッとした印象") {
                result = "あなたは｢秋タイプ｣です。";
            } else {
                result = "あなたは｢春タイプ｣です。";
            }
        }
        return result;
    };

    const resultText = calculateResult();

    return (
        <div>
            <h1>診断結果</h1>
            <p>{resultText}</p>
        </div>
    );
};

export default ResultPage;
