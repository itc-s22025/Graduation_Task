"use client";
import { useRouter } from "next/navigation";
import s from '@/styles/pcResult.module.css';

const ButtonGroup = ({ colorType }) => {
    const router = useRouter();

    const handleSignUpClick = () => {
        router.push(`/SignUp?color=${colorType}`); // クエリパラメータとして動的に colorType を送る
    };

    return (
        <>
            <div className={s.bottomContainer}>
                <div>
                    <button type="button" className={s.whatIsPcButton}>そもそもパーソナルカラーって？</button>
                    <button type="button" className={s.goBackToTopButton} onClick={() => router.push('/ColorDiagnosis')}>診断TOPに戻る</button>
                </div>
                <button
                    type="button"
                    className={s.toSignUpButton}
                    onClick={handleSignUpClick}
                >
                    サインアップ画面へ
                </button>
            </div>
        </>
    );
};

export default ButtonGroup;
