"use client";

import s from './personalColor.module.css';

import {useRouter} from "next/navigation";

const Pc = () => {
    const router = useRouter();

    return(
        <>
            <h1 className={s.question}>
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
                    <div className={s.flex}>
                        <button type="button" value="Spring" className={s.spring}>イエベ春</button>
                        <button type="button"　value="Summer" className={s.summer}>ブルベ夏</button>
                    </div>
                    <div className={s.flex}>
                        <button type="button" value="Autumn" className={s.autumn}>イエベ秋</button>
                        <button type="button" value="Winter" className={s.winter}>ブルベ冬</button>
                    </div>
                </div>

                <div className={s.submitContainer}>
                    <button className={s.next}>次へ</button>
                    <p className={s.or}>or</p>
                    <input type="submit" value="わからないので診断してみる" className={s.toTest}/>
                </div>
            </form>
        </>
    )
}

export default Pc