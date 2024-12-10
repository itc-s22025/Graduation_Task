import common from "@/styles/pcResult.module.css"
import s from "./page.module.css";
import FirstLayout from "@/components/FirstLayout"
import ButtonGroup from "@/components/pcResult"

const Winter = () => {
    return (
        <>
            <FirstLayout>
                <div className={common.allContainer}>
                    <div className={common.titleContainer}>
                        <p className={common.titleText}>あなたのパーソナルカラーは・・・</p>
                        <h1 className={s.wnTitle}>ブルベ冬 (winter)</h1>
                    </div>
                    <div className={common.mainContainer}>
                        <p className={common.explainText}>
                            ブルベ冬タイプのベースカラーはブルーで、シャープでキリッとかっこいい雰囲気。クールでクリアな印象を持っています。<br/>
                            肌はハリがあり、色が白い人は、透けるよような白さを持っています。目の印象が強く、瞳の色は真っ黒。<br/>
                            髪の色は真っ黒な人が多く、茶色っぽさがありません。メリハリがあるはっきりとした色が似合います。<br/>
                        </p>
                        <p className={common.pointContainer}>
                            <strong>似合うベースメイク：</strong> ピンク系の下地、ツヤ系のファンデーション。ツヤ肌、セミツヤ肌<br/>
                            <strong>似合うアイテム：</strong> シルバー系のアイテム、大きくて個性的なモチーフ、冷たい感じのプラスチック、メタリック素材など<br/>
                            <strong>似合うメイク：</strong> 青みよりのカラーで、ハッキリとした色味のシャープな印象のメイク。大粒のラメも◎<br/>
                            <strong>似合うファッション：</strong> 目の詰まったコットン、張りのあるウール、レザー、光沢のあるサテン、シルク、ベルベットなど　重い、厚い、硬い、光沢のある素材
                        </p>
                        <div className={s.colorsContainer}>
                            <h3>⦿ 似合う色</h3>
                            <div className={s.colors}>
                                <p className={s.wnColor1}>#e899bb</p>
                                <p className={s.wnColor2}>#d31176</p>
                                <p className={s.wnColor3}>#a61e2c</p>
                                <p className={s.wnColor4}>#e9e683</p>
                                <p className={s.wnColor5}>#1fa258</p>
                                <p className={s.wnColor6}>#1797cf</p>
                                <p className={s.wnColor7}>#144493</p>
                                <p className={s.wnColor8}>#11337b</p>
                                <p className={s.wnColor9}>#2f204c</p>
                                <p className={s.wnColor10}>#c9c9ca</p>
                                <p className={s.wnColor11}>#040000</p>
                            </div>
                        </div>

                        <div className={s.wnCharacterContainer}>
                            <h3>⦿ ブルベ冬のキャラクター(※たぶん)</h3>
                            <p>日向翔陽(ハイキュー‼)</p>
                        </div>

                        <div className={s.wnArtistContainer}>
                            <h3>⦿ ブルベ冬の芸能人</h3>
                            <p>黒木メイサさん、剛力彩芽さん、小松菜奈さん、小雪さん、柴咲コウさん、土屋太鳳さん、菜々緒さん、二階堂ふみさん　など</p>
                        </div>
                    </div>
                    <ButtonGroup colorType="winter"/>
                </div>
            </FirstLayout>
        </>
    )
}

export default Winter
