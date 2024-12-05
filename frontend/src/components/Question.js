"use client";

import React, { useState } from 'react';
import s from '../styles/question.module.css';

const Question = ({ number, questionText, options = [], handleSelectOptions }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleClick = (option) => {
        setSelectedOption(option);
        handleSelectOptions(option);
    };

    return (
        <div className={s.questionContainer}>
            <h2>Q{number}. {questionText}</h2>
            <div className={s.options}>
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`${s.optionAnswer} ${selectedOption === option ? s.selected : ''}`}
                        onClick={() => handleClick(option)}
                    >
                        {option}
                    </button>
                    ))}
                </div>
        </div>
    );
};

export default Question;
