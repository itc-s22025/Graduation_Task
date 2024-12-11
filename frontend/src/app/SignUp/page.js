"use client";

import { useState, useEffect, Suspense } from 'react';
import Detail from "@/app/SignUp/detail";
import FirstLayout from "@/components/FirstLayout";
import s from "@/app/SignUp/page.module.css";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/loadingPage";

const ColorSelector = ({ onSelect, onSetDetail }) => {
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const colorQuery = searchParams.get("color");

        if (colorQuery) {
            let color = null;
            switch (colorQuery) {
                case "spring":
                    color = "イエベ春";
                    break;
                case "summer":
                    color = "ブルベ夏";
                    break;
                case "autumn":
                    color = "イエベ秋";
                    break;
                case "winter":
                    color = "ブルベ冬";
                    break;
                default:
                    color = null;
            }

            if (color) {
                onSelect(color);
                onSetDetail(true);
            }
        }
    }, [onSelect, onSetDetail]);

    return null;
};

const SignUp = () => {
    // state
    const [selectedColor, setSelectedColor] = useState(null); // 選択された色を管理
    const [isDetail, setIsDetail] = useState(false);

    const router = useRouter();

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleNextClick = () => {
        setIsDetail(true);
    };

    return (
        <FirstLayout>
            <Suspense fallback={<LoadingPage />}>
                <ColorSelector
                    onSelect={setSelectedColor}
                    onSetDetail={setIsDetail}
                />
                <div className={s.allContainer}>
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
                                value="イエベ春"
                                className={`${s.spring} ${selectedColor === 'イエベ春' ? s.selectedSpring : ''}`}
                                onClick={() => handleColorSelect('イエベ春')}
                            >
                                イエベ春
                            </button>
                            <button
                                type="button"
                                value="ブルベ夏"
                                className={`${s.summer} ${selectedColor === 'ブルベ夏' ? s.selectedSummer : ''}`}
                                onClick={() => handleColorSelect('ブルベ夏')}
                            >
                                ブルベ夏
                            </button>
                            <button
                                type="button"
                                value="イエベ秋"
                                className={`${s.autumn} ${selectedColor === 'イエベ秋' ? s.selectedAutumn : ''}`}
                                onClick={() => handleColorSelect('イエベ秋')}
                            >
                                イエベ秋
                            </button>
                            <button
                                type="button"
                                value="ブルベ冬"
                                className={`${s.winter} ${selectedColor === 'ブルベ冬' ? s.selectedWinter : ''}`}
                                onClick={() => handleColorSelect('ブルベ冬')}
                            >
                                ブルベ冬
                            </button>
                        </div>

                        <div className={s.submitContainer}>
                            <button
                                type="button"
                                className={s.next}
                                onClick={handleNextClick}
                                disabled={!selectedColor} // 選択がない場合は無効化
                            >
                                次へ
                            </button>
                            <p className={s.or}>or</p>
                            <button type="button" className={s.toTest} onClick={() => router.push('/ColorDiagnosis')}>わからないので診断してみる</button>
                        </div>
                    </form>

                    {isDetail ? (<Detail myPC={selectedColor} />) : null}
                </div>
            </Suspense>
        </FirstLayout>
    );
};

export default SignUp;
