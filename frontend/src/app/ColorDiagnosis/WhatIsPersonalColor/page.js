"use client";

import MainLayout from "@/components/MainLayout";
import s from "./page.module.css"
import {useRouter} from "next/navigation";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import WhatIsPC from "@/components/whatIsPc"
import LoadingPage from "@/components/loadingPage";


const WhatIsPersonalColorPage = () => {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    // ローディング中の状態をハンドリング
    if (loading) {
        return <LoadingPage/>;
    }

    // ユーザーがログインしていない場合
    if (!user) {
        return <WhatIsPC />;
    }

    return(
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <div className={s.firstContainer}>
                        <h1 className={s.title}>パーソナルカラーって？</h1>
                    </div>
                    <blockquote className={s.blockquote}>
                        <h3 className={s.quote23BlockquoteH3}>第三者から見て似合う色のことです。</h3>
                        <p className={s.quote23BlockquoteP}>
                            パーソナルカラーとは、その人の肌、瞳、唇などの色に調和する色（似合う色のグループ）のことです。
                            とはいえ、肌の色に似た色とは限りません。
                            ４つの色のグループに「春」「夏」「秋」「冬」というニックネームをつけて、もっとも似合う色のグループがどのシーズンか診断するスタイルが広く知られています。<br/>
                            最近では、イエローベース・ブルーベースといったような用語なども、SNSなどで頻繁に目にするようになり、今や身に着けるものだけでなくメイクやヘアカラーにおいても、自分のイメージ作りに欠かせないものとなりました。
                        </p>
                        <cite className={s.blockquoteCite}>── NPO法人日本パーソナルカラー協会ホームページより引用</cite>
                    </blockquote>
                    <div className={s.secondContainer}>
                        <p>パーソナルカラーはふつう、「イエローベース」と「ブルーベース」に分かれます。<br/>
                            そこから更に、似合う色の明度・彩度や質感から、イエローベースの中でも「<span
                                className={s.spText}>春(spring)</span>」と「<span className={s.auText}>秋(autumn)</span>」、
                            ブルーベースの中でも「<span className={s.smText}>夏(summer)</span>」と「<span
                                className={s.wnText}>冬(winter)</span>」として、４つのグループに分割したものが有名です。<br/>
                            最近では、そこから更にセカンドシーズンごとにグループ分けをした16パーソナルカラーなども出てきています。<br/>
                            同じイエローベースでも、春タイプの人と秋タイプの人では似合う色や素材などが全く変わってきます。
                        </p>
                        <div className={s.colorExContainer}>
                            <p className={s.miniText}>似合う色の違い</p>
                            <div className={s.colorsContainer}>
                                <div className={s.seasonContainer}>
                                    <p>春</p>
                                    <p className={s.spColor1}/>
                                    <p className={s.spColor2}/>
                                    <p className={s.spColor3}/>
                                </div>
                                <div className={s.seasonContainer}>
                                    <p>秋</p>
                                    <p className={s.auColor1}/>
                                    <p className={s.auColor2}/>
                                    <p className={s.auColor3}/>
                                </div>
                                <div className={s.seasonContainer}>
                                    <p>夏</p>
                                    <p className={s.smColor1}/>
                                    <p className={s.smColor2}/>
                                    <p className={s.smColor3}/>
                                </div>
                                <div className={s.seasonContainer}>
                                    <p>冬</p>
                                    <p className={s.wnColor1}/>
                                    <p className={s.wnColor2}/>
                                    <p className={s.wnColor3}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={s.thirdContainer}>
                        <h3 className={s.yBOrBBTitle}>⦿イエローベースとブルーベースの違い</h3>
                        <p className={s.yBOrBBText}>
                            一般に、イエローベースの人は肌が色黒で、ブルーベースの人は色白……と思われがちですが、そんなことはありません。<br/>
                            イエローベースとブルーベースの違いは、「<span
                            className={s.yBOrBBBorder}>肌に色味（＝血色感）を足したほうが似合うか</span>」 「<span
                            className={s.yBOrBBBorder}>肌から色味を抜いたほうが似合うか</span> 」で判断されます。<br/>
                            例えば、イエベタイプの人が黄みの強い色を身につけると肌に血色感が増し明るい印象になりますが、青みの強い色を身につけると肌がくすんで顔色が悪く見えてしまいます。
                            反対に、ブルベタイプの人が黄みの強い色を身につけると肌が黄ぐすみしてしまいますが、青みの強い色を身につけると肌に透明感が出てみずみずしい印象になります。<br/>
                            このように、イエローベースとブルーベースは肌の明暗ではなく、「肌に血色感を足すか、引くか」で判断します。
                        </p>
                        <div>
                            <div>
                                <div className={s.skinContainer}>
                                    <p className={s.spSkin}/>
                                    <p className={s.skinText}>イエベ春：黄みがかった明るくツヤのある肌。瞳や髪の色素が明るめで、細くやわらかい毛質。光沢感のある華やかなゴールド系のアクセサリーが似合う</p>
                                </div>
                                <div className={s.skinContainer}>
                                    <p className={s.auSkin}/>
                                    <p className={s.skinText}>イエベ秋：黄みがかったやや暗いトーンのマットな肌。瞳や髪は濃いブラウンで、ハリ・コシのある毛質。マットな質感やアンティーク調のゴールド系アクセサリーが似合う</p>
                                </div>
                                <div className={s.skinContainer}>
                                    <p className={s.smSkin}/>
                                    <p className={s.skinText}>ブルベ夏：ピンクみがあり、薄く透明感のある肌。瞳や髪は赤みやグレーみのある色素で、やわらかな毛質。ソフトマットなシルバー系のアクセサリーが似合う</p>
                                </div>
                                <div className={s.skinContainer}>
                                    <div className={s.wnSkinContainer}>
                                        <p className={s.wnSkin1}/>
                                        <p className={s.wnSkin2}/>
                                    </div>
                                    <p className={s.skinText}>ブルベ冬：ピンクみがあり、やや厚くハリがある肌。瞳や髪は真っ黒な場合が多く、ハリやコシのあるしっかりした毛質。光沢感があるシルバー系のゴージャスなアクセサリーが似合う</p>
                                </div>
                            </div>
                            <div className={s.tipsContainer}>
                                <p className={s.tipsTitle}>TIPS!</p>
                                <p className={s.tipsText}>「イエベ春だけど、髪質は太くてしっかりしている」「ブルベ冬だけど、マットな質感が似合う」という人は、セカンドシーズンが関係しているかも？</p>
                                <Link href={'https://www.lapis234.com/16TPC-self/'} className={s.link}>〉〉　16パーソナルカラーについて（外部ページにリンクします）</Link>
                            </div>
                        </div>
                    </div>
                    <button type="button" className={s.backToResultButton}
                            onClick={() => router.push('/ColorDiagnosis')}>〈〈　診断結果に戻る
                    </button>
                </div>
            </MainLayout>
        </>
    )
}

export default WhatIsPersonalColorPage;