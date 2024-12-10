"use client";

import { useState,useEffect } from 'react';
import Detail from "@/app/SignUp/detail";
import FirstLayout from "@/components/FirstLayout";
import s from "@/app/SignUp/page.module.css";
import {useSearchParams} from "next/navigation";

const SignUp = () => {
    //state
    const [selectedColor, setSelectedColor] = useState(null); // 選択された色を管理
    const [isDetail, setIsDetail] = useState(false);

    // クエリパラメータを取得
    const searchParams = useSearchParams();
    const colorQuery = searchParams.get("color");

    // クエリパラメータが存在する場合の処理
    useEffect(() => {
        if (colorQuery) {
            // クエリパラメータに基づいて selectedColor を設定
            switch (colorQuery) {
                case "spring":
                    setSelectedColor("イエベ春");
                    break;
                case "summer":
                    setSelectedColor("ブルベ夏");
                    break;
                case "autumn":
                    setSelectedColor("イエベ秋");
                    break;
                case "winter":
                    setSelectedColor("ブルベ冬");
                    break;
                default:
                    setSelectedColor(null); // 不明なクエリの場合は null に設定
            }
            setIsDetail(true); // isDetail を true に設定
        }
    }, [colorQuery]);


    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleNextClick = () => {
        console.log("ハンドルネクストクリック：", selectedColor)
        setIsDetail(true);
    }


    return (
                <>
                    <FirstLayout>
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
                                    <input
                                        type="submit"
                                        value="わからないので診断してみる"
                                        className={s.toTest}
                                    />
                                </div>
                            </form>

                            {isDetail ? ( <Detail myPC={selectedColor}/>) : null}
                        </div>
            </FirstLayout>
        </>
    );
};

export default SignUp;