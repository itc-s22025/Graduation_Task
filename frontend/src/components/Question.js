import React from 'react';
import s from '../styles/question.module.css';

const Question = ({ number, questionText }) => {
    return (
        <div className={s.questionContainer}>
            <h2 className={s.questionTitle}>Q{number}.</h2>
            <p className={s.questionText}>{questionText}</p>
        </div>
    );
};

export default Question;
