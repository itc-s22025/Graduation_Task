import common from "@/styles/pcResult.module.css"
import s from "./page.module.css";
import FirstLayout from "@/components/FirstLayout"
import ButtonGroup from "@/components/pcResult"

const Summer = () => {
    return (
        <>
            <FirstLayout>
                <div className={common.allContainer}>
                    <div className={common.titleContainer}>
                        <p className={common.titleText}>あなたのパーソナルカラーは・・・</p>
                        <h1 className={s.smTitle}>ブルベ夏 (summer)</h1>
                    </div>
                    <div className={common.mainContainer}>
                        <p className={common.explainText}>
                            ブルベ夏タイプのベースカラーはブルーで、柔らかく清涼感がある雰囲気。上品で知的な印象を持っています。<br/>
                            肌は薄く透明感があり、きめ細かい肌質です。瞳の色は赤みがかったブラウンや薄い黒色。<br/>
                            髪質は細くて柔らかく、地毛の色はソフトな黒で、涼しげで柔らかい色が似合います。<br/>
                        </p>
                        <div className={common.pointContainer}>
                            <p>
                                <strong>似合うベースメイク：</strong> パープルやピンク系の下地で透明感を上げるメイク。セミツヤ肌、セミマット肌<br/>
                                <strong>似合うアイテム：</strong> 光沢のないシルバー系のアイテムやピンクゴールド系、透明なビーズ、繊細で華奢なデザインのもの<br/>
                                <strong>似合うメイク：</strong> 青み寄りのカラーで、細かいラメやパールを使ったソフトでフェミニンな印象のもの<br/>
                                <strong>似合うファッション：</strong> ジョーゼット(薄くシャリ感のある生地)、シフォン、レース(ケミカルなもの)、光沢のないシルクなど　軽い、薄い、柔らかい、光沢のない素材
                            </p>
                        </div>
                        <div className={s.colorsContainer}>
                            <h3>⦿ 似合う色</h3>
                            <div className={s.colors}>
                                <p className={s.smColor1}>#f0ebb5</p>
                                <p className={s.smColor2}>#e899bb</p>
                                <p className={s.smColor3}>#d66891</p>
                                <p className={s.smColor4}>#be2838</p>
                                <p className={s.smColor5}>#a1cda8</p>
                                <p className={s.smColor6}>#109f76</p>
                                <p className={s.smColor7}>#b1d6e2</p>
                                <p className={s.smColor8}>#70b2de</p>
                                <p className={s.smColor9}>#c3bddb</p>
                                <p className={s.smColor10}>#9593b9</p>
                                <p className={s.smColor11}>#5c6063</p>
                            </div>
                        </div>

                        <div className={s.smCharacterContainer}>
                            <h3>⦿ ブルベ夏のキャラクター(※たぶん)</h3>
                            <p>日向翔陽(ハイキュー‼)</p>
                        </div>

                        <div className={s.smArtistContainer}>
                            <h3>⦿ ブルベ夏の芸能人</h3>
                            <p>綾瀬はるかさん、新垣結衣さん、有村架純さん、石原さとみさん、広末涼子さん、広瀬すずさん、松嶋菜々子さん　など</p>
                        </div>
                    </div>
                    <ButtonGroup colorType="summer"/>
                </div>
            </FirstLayout>
        </>
    )
}

export default Summer
