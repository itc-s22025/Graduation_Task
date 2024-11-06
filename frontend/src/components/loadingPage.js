import s from '@/styles/loadingPage.module.css'

const LoadingPage = () => {
    return(
        <>
            <div className={s.allContainer}>
                <div className={s.loadingContainer}>
                    <img src="/cutie_heart_after.png" className={s.heart}/>
                    <h1 className={s.loadingText}>
                        <span className={s.letter}>L</span>
                        <span className={s.letter}>o</span>
                        <span className={s.letter}>a</span>
                        <span className={s.letter}>d</span>
                        <span className={s.letter}>i</span>
                        <span className={s.letter}>n</span>
                        <span className={s.letter}>g</span>
                        <span className={s.letter}>.</span>
                        <span className={s.letter}>.</span>
                        <span className={s.letter}>.</span>
                    </h1>
                </div>
            </div>
        </>
    )
}

export default LoadingPage;