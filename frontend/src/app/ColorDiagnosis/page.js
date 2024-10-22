import Leftbar_before_home from "@/components/leftbar_before_home";
import s from './page.module.css';
import Question from '@/components/Question'; // 新しく作成したコンポーネントをインポート

const ColorDiagnosisPage = (props) => {
    // 質問をリストで定義
    const questions = [
        "目の色・印象は？",
        "黒目と白目のコントラストは？",
        "髪の毛の元々の色は？(染めている色に合わせる場合はそれでもOK)",
        "肌の色は？",
        "日に焼けると？",
        "顔色は？",
        "顔の印象は？",
        "似合うと思うアクセサ    background-color: #f9f9f9;リーの色は？",
        "よく着る色、似合うと思う色は？",
    ];

    return (
        <>
            <div className={s.parent}>
                <div className={s.colum1}>
                    <Leftbar_before_home />
                </div>
                <div className={s.colum2}>
                    <h1 className={s.font}>パーソナルカラー診断</h1>

                    {/* 質問を表示 */}
                    {questions.map((question, index) => (
                        <Question key={index} number={index + 1} questionText={question} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ColorDiagnosisPage;

// import Leftbar_before_home from "@/components/leftbar_before_home";
// import s from './page.module.css'
//
// const ColorDiagnosisPage = (props) => {
//     return (
//         <>
//             <div className={s.parent}>
//                 <div className={s.colum1}>
//                     <Leftbar_before_home/>
//                 </div>
//                 <div className={s.colum2}>
//                     <h1 className={s.font}>パーソナルカラー診断</h1>
//                     <h2 className={s.question}>Q1.</h2>
//                 </div>
//             </div>
//         </>
//     )
// }
// export default ColorDiagnosisPage;