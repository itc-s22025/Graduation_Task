import s from '@/styles/pcResult.module.css'

const ButtonGroup = () => {
    return(
        <>
            <div className={s.bottomContainer}>
                <div>
                    <button type="button" className={s.whatIsPcButton}>そもそもパーソナルカラーって？</button>
                    <button type="button" className={s.goBackToTopButton}>診断TOPに戻る</button>
                </div>
                <button type="button" className={s.toSignUpButton}>サインアップ画面へ</button>
            </div>
        </>
    )
}

const Spring = () => {
    return (
        <>
            <div className={s.allContainer}>
                <div className={s.titleContainer}>
                    <p className={s.titleText}>あなたのパーソナルカラーは・・・</p>
                    <h1 className={s.spTitle}>イエベ春 (spring)</h1>
                </div>
                <div className={s.mainContainer}>
                    <p className={s.explainText}>イエベ春タイプのベースカラーはイエローで、可愛らしく若々しい印象を持っています。<br/>
                        ブルベタイプよりも肌に黄色みがあり、イエベタイプの中でも春タイプは肌が明るくツヤがあります。<br/>
                        瞳の色は薄く、茶色系の瞳。髪の毛も色素が薄い人が多く、細くてツヤのある人が多いです。明るい茶色系のカラーが似合います。<br/>
                        似合うベースメイク：　自肌を活かしたツヤ肌<br/>
                        似合うアイテム：　光沢のあるゴールド系のアイテム、小さめの可愛らしいデザインのもの<br/>
                        似合うメイク：　クリアではっきりとした色味のもの<br/>
                        似合うファッション：　コットンなどのハリのある素材
                    </p>
                    <div className={s.colorsContainer}>
                        <h3 className={s.subTitleText}>⦿ 似合う色</h3>
                        <div className={s.colors}>
                            <p className={s.spColor1}>#f4e158</p>
                            <p className={s.spColor2}>#e5ad26</p>
                            <p className={s.spColor3}>#a5c860</p>
                            <p className={s.spColor4}>#309e39</p>
                            <p className={s.spColor5}>#9dd1d7</p>
                            <p className={s.spColor6}>#0a679d</p>
                            <p className={s.spColor7}>#e1c589</p>
                            <p className={s.spColor8}>#904d23</p>
                            <p className={s.spColor9}>#f4cdc2</p>
                            <p className={s.spColor10}>#dd5e6b</p>
                            <p className={s.spColor11}>#8a4788</p>
                        </div>
                    </div>

                    <div className={s.spCharacterContainer}>
                        <h3 className={s.subTitleText}>⦿ イエベ春のキャラクター(※たぶん)</h3>
                        <p>日向翔陽(ハイキュー‼)</p>
                    </div>

                    <div className={s.spArtistContainer}>
                        <h3 className={s.subTitleText}>⦿ イエベ春の芸能人</h3>
                        <p>上戸彩さん、桐谷美玲さん、佐々木希さん、多部未華子さん、長澤まさみさん、深田恭子さん、本田翼さん</p>
                    </div>
                </div>
                <ButtonGroup/>
            </div>
        </>
    )
}

const Summer = () => {
    return (
        <>
            <p>SUMMER</p>
        </>
    )
}

const Autumn = () => {
    return (
        <>
            <p>AUTUMN</p>
        </>
    )
}

const Winter = () => {
    return(
        <>
            <p>WINTER</p>
        </>
    )
}

export {Spring, Summer, Autumn, Winter}