import common from "@/styles/pcResult.module.css"
import s from "./page.module.css";
import FirstLayout from "@/components/FirstLayout"
import {ButtonGroup} from "@/components/pcResult"

const Autumn = () => {
    return (
        <>
            <FirstLayout>
                <div className={common.allContainer}>
                    <div className={common.titleContainer}>
                        <p className={common.titleText}>あなたのパーソナルカラーは・・・</p>
                        <h1 className={s.auTitle}>イエベ秋 (autumn)</h1>
                    </div>
                    <div className={common.mainContainer}>
                        <p className={common.explainText}>
                            イエベ秋タイプのベースカラーはイエローで、落ち着いた都会的な雰囲気。シックで暖かみのある印象を持っています。<br/>
                            肌はやや冷たい黄身がかった濃い肌色で、マットな質感です。瞳の色はダークブラウン系の色。<br/>
                            髪色はダークブラウン〜黒。質感はハリがあり、ツヤは少なめです。くすみカラーやアースカラーが似合います。<br/>
                        </p>
                        <p className={common.pointContainer}>
                            <strong>似合うベースメイク：</strong> オークル系やベージュ系など、明るすぎない、落ち着いたトーン。マット肌、セミマット肌<br/>
                            <strong>似合うアイテム：</strong> ツヤのないゴールド系、大ぶりのアイテム、ウッドビーズ、レザー素材など<br/>
                            <strong>似合うメイク：</strong> マットな質感の落ち着いたメイク。黄み寄りの暗めカラー、ラメは大粒なものが◎<br/>
                            <strong>似合うファッション：</strong> 厚手の麻・コットン(綿)・ウール(毛)、網目の大きなニット、コーデュロイ、ムートン・スエードなど　重い、厚い、硬い、光沢のない素材
                        </p>
                        <div className={s.colorsContainer}>
                            <h3>⦿ 似合う色</h3>
                            <div className={s.colors}>
                                <p className={s.auColor1}>#d0a544</p>
                                <p className={s.auColor2}>#e8ca2d</p>
                                <p className={s.auColor3}>#e2983e</p>
                                <p className={s.auColor4}>#d37020</p>
                                <p className={s.auColor5}>#abb138</p>
                                <p className={s.auColor6}>#498d37</p>
                                <p className={s.auColor7}>#43a6a0</p>
                                <p className={s.auColor8}>#176972</p>
                                <p className={s.auColor9}>#8f1e22</p>
                                <p className={s.auColor10}>#61451f</p>
                                <p className={s.auColor11}>#452d5f</p>
                            </div>
                        </div>

                        <div className={s.auCharacterContainer}>

                            <h3>⦿ イエベ秋のカラーを持つキャラクター(※たぶん)</h3>
                            <p>藤堂平助(薄桜鬼)、七海健人(呪術廻戦)、花垣武道・佐野万次郎(東京卍リベンジャーズ)、草摩はとり(フルーツバスケット)、 エレン・イェーガー(進撃の巨人)、リサリサ(ジョジョの奇妙な冒険)</p>

                        </div>

                        <div className={s.auArtistContainer}>
                            <h3>⦿ イエベ秋の芸能人</h3>
                            <p>安室奈美恵さん、今田美桜さん、北川景子さん、山本美月さん、川口春奈さん、高畑充希さん、中村アンさん、新木優子さん　など</p>
                        </div>
                    </div>
                    <ButtonGroup colorType="autumn"/>
                </div>
            </FirstLayout>
        </>
    )
}

export default Autumn
