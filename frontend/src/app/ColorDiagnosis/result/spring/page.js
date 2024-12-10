import common from "@/styles/pcResult.module.css"
import s from "./page.module.css";
import FirstLayout from "@/components/FirstLayout"
import ButtonGroup from "@/components/pcResult"

const Spring = () => {
    return (
        <>
            <FirstLayout>
                <div className={common.allContainer}>
                    <div className={common.titleContainer}>
                        <p className={common.titleText}>あなたのパーソナルカラーは・・・</p>
                        <h1 className={s.spTitle}>イエベ春 (spring)</h1>
                    </div>
                    <div className={common.mainContainer}>
                        <p className={common.explainText}>イエベ春タイプのベースカラーはイエローで、可愛らしく若々しい印象を持っています。<br/>
                            ブルベタイプよりも肌に黄色みがあり、イエベタイプの中でも春タイプは肌が明るくツヤがあります。<br/>
                            瞳の色は薄く、茶色系の瞳。髪の毛も色素が薄い人が多く、細くてツヤのある人が多いです。明るい茶色系のカラーが似合います。<br/>
                        </p>
                        <div className={common.pointContainer}>
                            <p>
                                <strong>似合うベースメイク：</strong> イエロー・オレンジ系の下地で肌の血色をアップ。ツヤ肌、セミツヤ肌<br/>
                                <strong>似合うアイテム：</strong> 光沢のあるゴールド系のアイテム、カラフルなビーズ、スパンコールなど。小さめの可愛らしいデザインのもの<br/>
                                <strong>似合うメイク：</strong> 黄み寄りで、クリアで明るめな色味のもの。ラメやパールは小さめで細かいものが◎<br/>
                                <strong>似合うファッション：</strong> コットン、デニム、ジャージ素材、薄手のウール、サテンなど　軽い、薄い、やわらかい、光沢のある素材
                            </p>
                        </div>
                        <div className={s.colorsContainer}>
                            <h3>⦿ 似合う色</h3>
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
                            <h3>⦿ イエベ春のキャラクター(※たぶん)</h3>
                            <p>日向翔陽(ハイキュー‼)</p>
                        </div>

                        <div className={s.spArtistContainer}>
                            <h3>⦿ イエベ春の芸能人</h3>
                            <p>上戸彩さん、桐谷美玲さん、佐々木希さん、多部未華子さん、長澤まさみさん、深田恭子さん、本田翼さん、橋本環奈さん、宮脇咲良さん　など</p>
                        </div>
                    </div>
                    <ButtonGroup colorType="spring"/>
                </div>
            </FirstLayout>
        </>
    )
}

export default Spring