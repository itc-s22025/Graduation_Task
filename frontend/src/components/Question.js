import React from 'react';
import s from "@/styles/question.module.css";

const Question = ({ number, questionText, options, handleSelectOptions, selectedOption }) => {

    const handleClick = (index) => {
        handleSelectOptions(index); // 親コンポーネントにインデックスを渡す
    };

    return (
        <div className={s.questionContainer}>
            <h2>Q.{number}. {questionText}</h2>
            <div className={s.options}>
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`${s.optionAnswer} ${selectedOption === index ? s.selected : ''}`}
                        onClick={() => handleClick(index)} // インデックスを親コンポーネントに渡す
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Question;
