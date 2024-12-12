"use client";
import { useRouter } from "next/navigation";
import s from "@/styles/pcResult.module.css";

const ButtonGroup = ({ colorType }) => {
    const router = useRouter();

    const handleSignUpClick = () => {
        router.push(`/SignUp?color=${colorType}`); // クエリパラメータとして動的に colorType を送る
    };

    return (
        <>
            <div className={s.bottomContainer}>
                <div>
                    <button type="button" className={s.whatIsPcButton} onClick={() => router.push('/ColorDiagnosis/WhatIsPersonalColor')}>そもそもパーソナルカラーって？</button>
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

const Spring = () => {
    const router = useRouter();

    return(
        <>
            <div className={s.loggedInAllContainer}>
                <div className={s.titleContainer}>
                    <p className={s.titleText}>あなたのパーソナルカラーは・・・</p>
                    <h1 className={s.spTitle}>イエベ春 (spring)</h1>
                </div>
                <div className={s.mainContainer}>
                    <p className={s.explainText}>イエベ春タイプのベースカラーはイエローで、可愛らしく若々しい印象を持っています。<br/>
                        ブルベタイプよりも肌に黄色みがあり、イエベタイプの中でも<br/>春タイプは肌が明るくツヤがあります。<br/>
                        瞳の色は薄く、茶色系の瞳。髪の毛も色素が薄い人が多く、<br/>細くてツヤのある人が多いです。明るい茶色系のカラーが似合います。<br/>
                    </p>
                    <div className={s.pointContainer}>
                        <p>
                            <strong>似合うベースメイク：</strong> イエロー・オレンジ系の下地で肌の血色をアップ。ツヤ肌、セミツヤ肌<br/>
                            <strong>似合うアイテム：</strong> 光沢のあるゴールド系のアイテム、カラフルなビーズ、スパンコールなど。小さめの可愛らしいデザインのもの<br/>
                            <strong>似合うメイク：</strong> 黄み寄りで、クリアで明るめな色味のもの。ラメやパールは小さめで細かいものが◎<br/>
                            <strong>似合うファッション：</strong> コットン、デニム、ジャージ素材、薄手のウール、サテンなど
                            軽い、薄い、やわらかい、光沢のある素材
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

                    <div className={s.characterContainer}>
                        <h3>⦿ イエベ春のカラーをもつキャラクター(※たぶん)</h3>
                        <p>孫悟空(超サイヤ人)/『DRAGON BALL』、バターカップ/『The Powerpuff
                            Girls』、セーラーマーキュリー/『美少女戦士セーラームーン』、夏目貴志/『夏目友人帳』</p>
                    </div>

                    <div className={s.artistContainer}>
                        <h3>⦿ イエベ春の芸能人</h3>
                        <p>上戸彩さん、桐谷美玲さん、佐々木希さん、多部未華子さん、長澤まさみさん、深田恭子さん、本田翼さん、橋本環奈さん、宮脇咲良さん
                            など</p>
                    </div>
                </div>
                <button type="button" className={s.loggedInWhatIsPcButton} onClick={() => router.push('/ColorDiagnosis/WhatIsPersonalColor')}>そもそもパーソナルカラーって？</button>
            </div>
        </>
    )
}

const Summer = () => {
    const router = useRouter();

    return(
        <>
            <div className={s.loggedInAllContainer}>
                <div className={s.titleContainer}>
                    <p className={s.titleText}>あなたのパーソナルカラーは・・・</p>
                    <h1 className={s.smTitle}>ブルベ夏 (summer)</h1>
                </div>
                <div className={s.mainContainer}>
                    <p className={s.explainText}>
                        ブルベ夏タイプのベースカラーはブルーで、柔らかく清涼感がある雰囲気。<br/>
                        上品で知的な印象を持っています。<br/>
                        肌は薄く透明感があり、きめ細かい肌質です。<br/>
                        瞳の色は赤みがかったブラウンや薄い黒色。<br/>
                        髪質は細くて柔らかく、地毛の色はソフトな黒で、涼しげで柔らかい色が似合います。<br/>
                    </p>
                    <div className={s.pointContainer}>
                        <p>
                            <strong>似合うベースメイク：</strong> パープルやピンク系の下地で透明感を上げるメイク。セミツヤ肌、セミマット肌<br/>
                            <strong>似合うアイテム：</strong> 光沢のないシルバー系のアイテムやピンクゴールド系、透明なビーズ、繊細で華奢なデザインのもの<br/>
                            <strong>似合うメイク：</strong> 青み寄りのカラーで、細かいラメやパールを使ったソフトでフェミニンな印象のもの<br/>
                            <strong>似合うファッション：</strong> ジョーゼット(薄くシャリ感のある生地)、シフォン、レース(ケミカルなもの)、光沢のないシルクなど
                            軽い、薄い、柔らかい、光沢のない素材
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

                    <div className={s.characterContainer}>
                        <h3>⦿ ブルベ夏のキャラクター(※たぶん)</h3>
                        <p>日向翔陽(ハイキュー‼)</p>
                    </div>

                    <div className={s.artistContainer}>
                        <h3>⦿ ブルベ夏の芸能人</h3>
                        <p>綾瀬はるかさん、新垣結衣さん、有村架純さん、石原さとみさん、広末涼子さん、広瀬すずさん、松嶋菜々子さん
                            など</p>
                    </div>
                </div>
                <button type="button" className={s.loggedInWhatIsPcButton} onClick={() => router.push('/ColorDiagnosis/WhatIsPersonalColor')}>そもそもパーソナルカラーって？</button>
            </div>
        </>
    )
}

const Autumn = () => {
    return (
        <>
            <div className={s.loggedInAllContainer}>
                <div className={s.titleContainer}>
                    <p className={s.titleText}>あなたのパーソナルカラーは・・・</p>
                    <h1 className={s.auTitle}>イエベ秋 (autumn)</h1>
                </div>
                <div className={s.mainContainer}>
                    <p className={s.explainText}>
                        イエベ秋タイプのベースカラーはイエローで、落ち着いた都会的な雰囲気。<br/>
                        シックで暖かみのある印象を持っています。<br/>
                        肌はやや冷たい黄身がかった濃い肌色で、マットな質感です。<br/>
                        瞳の色はダークブラウン系の色。<br/>
                        髪色はダークブラウン〜黒。質感はハリがあり、ツヤは少なめです。<br/>
                        くすみカラーやアースカラーが似合います。<br/>
                    </p>
                    <p className={s.pointContainer}>
                        <strong>似合うベースメイク：</strong> オークル系やベージュ系など、明るすぎない、落ち着いたトーン。マット肌、セミマット肌<br/>
                        <strong>似合うアイテム：</strong> ツヤのないゴールド系、大ぶりのアイテム、ウッドビーズ、レザー素材など<br/>
                        <strong>似合うメイク：</strong> マットな質感の落ち着いたメイク。黄み寄りの暗めカラー、ラメは大粒なものが◎<br/>
                        <strong>似合うファッション：</strong> 厚手の麻・コットン(綿)・ウール(毛)、網目の大きなニット、コーデュロイ、ムートン・スエードなど
                        重い、厚い、硬い、光沢のない素材
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

                    <div className={s.characterContainer}>
                        <h3>⦿ イエベ秋のキャラクター(※たぶん)</h3>
                        <p>日向翔陽(ハイキュー‼)</p>
                    </div>

                    <div className={s.artistContainer}>
                        <h3>⦿ イエベ秋の芸能人</h3>
                        <p>安室奈美恵さん、今田美桜さん、北川景子さん、山本美月さん、川口春奈さん、高畑充希さん、中村アンさん、新木優子さん
                            など</p>
                    </div>
                </div>
                <button type="button" className={s.loggedInWhatIsPcButton}>そもそもパーソナルカラーって？</button>
            </div>
        </>
    )
}

const Winter = () => {
    return(
        <>
            <div className={s.loggedInAllContainer}>
                <div className={s.titleContainer}>
                    <p className={s.titleText}>あなたのパーソナルカラーは・・・</p>
                    <h1 className={s.wnTitle}>ブルベ冬 (winter)</h1>
                </div>
                <div className={s.mainContainer}>
                    <p className={s.explainText}>
                        ブルベ冬タイプのベースカラーはブルーで、シャープでキリッとかっこいい雰囲気。<br/>
                        クールでクリアな印象を持っています。<br/>
                        肌はハリがあり、色が白い人は、透けるよような白さを持っています。<br/>
                        目の印象が強く、瞳の色は真っ黒。<br/>
                        髪の色は真っ黒な人が多く、茶色っぽさがありません。<br/>
                        メリハリがあるはっきりとした色が似合います。<br/>
                    </p>
                    <p className={s.pointContainer}>
                        <strong>似合うベースメイク：</strong> ピンク系の下地、ツヤ系のファンデーション。ツヤ肌、セミツヤ肌<br/>
                        <strong>似合うアイテム：</strong> シルバー系のアイテム、大きくて個性的なモチーフ、冷たい感じのプラスチック、メタリック素材など<br/>
                        <strong>似合うメイク：</strong> 青みよりのカラーで、ハッキリとした色味のシャープな印象のメイク。大粒のラメも◎<br/>
                        <strong>似合うファッション：</strong> 目の詰まったコットン、張りのあるウール、レザー、光沢のあるサテン、シルク、ベルベットなど
                        重い、厚い、硬い、光沢のある素材
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

                    <div className={s.characterContainer}>
                        <h3>⦿ ブルベ冬のカラーをもつキャラクター</h3>
                        <p>飴村乱数(ヒプノシスマイク)、緑谷出久(僕のヒーローアカデミア)、アラジン(マギ)、轟焦凍(僕のヒーローアカデミア)、赤羽業(暗殺教室)、 クロロ＝ルシルフル(HUNTER×HUNTER)</p>
                    </div>

                    <div className={s.artistContainer}>
                        <h3>⦿ ブルベ冬の芸能人</h3>
                        <p>黒木メイサさん、剛力彩芽さん、小松菜奈さん、小雪さん、柴咲コウさん、土屋太鳳さん、菜々緒さん、二階堂ふみさん
                            など</p>
                    </div>
                </div>
                <button type="button" className={s.loggedInWhatIsPcButton}>そもそもパーソナルカラーって？</button>
            </div>
        </>
    )
}

export {ButtonGroup, Spring, Summer, Autumn, Winter};
