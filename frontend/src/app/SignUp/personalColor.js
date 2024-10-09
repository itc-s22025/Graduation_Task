"use client";
import { useState } from 'react';
import s from './personalColor.module.css';

const Pc = ({ onNext, onSelectColor }) => {
    const [selectedColor, setSelectedColor] = useState(null); // 選択された色を管理

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        onSelectColor(color); // 選択を親コンポーネントに通知
    };

    return (
        <>
            <h1 className={s.question}>
                <span className={s.letter}>Q</span>
                <span className={s.letter}>. </span>
                <span className={s.letter}>あ</span>
                <span className={s.letter}>な</span>
                <span className={s.letter}>た</span>
                <span className={s.letter}>の</span>
                <span className={s.letter}>パ</span>
                <span className={s.letter}>ー</span>
                <span className={s.letter}>ソ</span>
                <span className={s.letter}>ナ</span>
                <span className={s.letter}>ル</span>
                <span className={s.letter}>カ</span>
                <span className={s.letter}>ラ</span>
                <span className={s.letter}>ー</span>
                <span className={s.letter}>は</span>
                <span className={s.letter}>？</span>
            </h1>
            <form>
                <div className={s.pcContainer}>
                    <button
                        type="button"
                        value="Spring"
                        className={`${s.spring} ${selectedColor === 'Spring' ? s.selectedSpring : ''}`}
                        onClick={() => handleColorSelect('Spring')}
                    >
                        イエベ春
                    </button>
                    <button
                        type="button"
                        value="Summer"
                        className={`${s.summer} ${selectedColor === 'Summer' ? s.selectedSummer : ''}`}
                        onClick={() => handleColorSelect('Summer')}
                    >
                        ブルベ夏
                    </button>
                    <button
                        type="button"
                        value="Autumn"
                        className={`${s.autumn} ${selectedColor === 'Autumn' ? s.selectedAutumn : ''}`}
                        onClick={() => handleColorSelect('Autumn')}
                    >
                        イエベ秋
                    </button>
                    <button
                        type="button"
                        value="Winter"
                        className={`${s.winter} ${selectedColor === 'Winter' ? s.selectedWinter : ''}`}
                        onClick={() => handleColorSelect('Winter')}
                    >
                        ブルベ冬
                    </button>
                </div>

                <div className={s.submitContainer}>
                    <button
                        type="button"
                        className={s.next}
                        onClick={onNext}
                        disabled={!selectedColor} // 選択がない場合は無効化
                    >
                        次へ
                    </button>
                    <p className={s.or}>or</p>
                    <input
                        type="submit"
                        value="わからないので診断してみる"
                        className={s.toTest}
                    />
                </div>
            </form>
        </>
    );
};

export default Pc;
