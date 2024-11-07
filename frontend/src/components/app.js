import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ColorDiagnosisPage from "@/app/ColorDiagnosis/page";
import Leftbar_before_home from "@/components/leftbar_before_home";
// import Result from "@/components/result";

const App = () => {

    const questions = [
        {
            question: "目の色・印象は？",
            options: ["真っ黒か黒に近い焦げ茶でキラキラ", "黒っぽいがぼんやりと優しくソフトな印象", "明るい〜濃い茶色でキラキラ輝いている印象", "こげ茶や緑がかった茶色でぼんやりした印象"]
        },
        {
            question: "黒目と白目のコントラストは？",
            options: ["はっきりしていてキリッとした印象", "ぼんやりとしていてソフトな印象", "はっきりしていてキラキラした印象", "ぼんやりしていて深みがある印象"]
        },
        {
            question: "髪の毛の元々の色は？(染めている色に合わせる場合はそれでもOK)",
            options: ["こげ茶〜黒くてツヤツヤ、カラスの濡れ羽色", "こげ茶〜ソフトな印象の黒髪", "明るい茶色〜こげ茶で艶がある", "こげ茶〜黒色でぼんやりした印象"]
        },
        {
            question: "肌の色は？",
            options: ["ピンク系〜普通肌〜色黒で血色が良くない", "ピンク系で色が透けるように白い", "オークル系で色白、血色が良い", "色白〜色黒のオリーブ肌で素顔だと顔色が悪い"]
        },
        {
            question: "日に焼けると？",
            options: ["日に焼けやすく小麦色になる", "赤くなって冷める、とても焼けにくい", "赤くなって冷める、比較的焼けにくい", "黒くなりやすくシミになりやすい"]
        },
        {
            question: "顔色は？",
            options: ["普通〜色黒で顔色が悪いまたは赤っぽい", "色白でピンクっぽくパウダリーな印象", "色白で黄色味があり、血色が良い", "色白〜色黒で黄色味が強く、素顔だと血色が悪い"]
        },
        {
            question: "顔の印象は？",
            options: ["キリッとはっきりして濃い印象", "ソフトでエレガントな印象", "柔らかくて明るい印象", "落ち着いたシックな印象"]
        },
        {
            question: "似合うと思うアクセサリーの色は？",
            options: ["黒っぽい加工のシルバー、プラチナ、オニキス、ブラックパール", "磨いてあるシルバー、パール、ピンクや水色の半貴石やクリスタル", "磨いてあるゴールド、パール、ペリドット、アクアマリン", "燻したゴールド、マットなゴールド、べっ甲、ブロンズ"]
        },
        {
            question: "よく着る色、似合うと思う色は？",
            options: ["ブラック、ネイビー、ピュアホワイト、真っ赤、ロイヤルブルー、マゼンタピンク", "明るい紺、薄いグレー、オフホワイト、水色、ラベンダー、ピンク", "キャメル、アイボリー、イエロー、オレンジレッド、コーラルピンク、アクア", "ダークブラウン、カーキ、オリーブグリーン、ラスト、パンプキン、ティールブルー"]
        }
    ];

    export default App;