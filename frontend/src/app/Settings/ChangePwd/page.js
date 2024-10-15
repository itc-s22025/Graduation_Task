import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";
import s from "./pwd.module.css";

const Password = (props) => {
    return (
        <>
            <MainLayout>
                <AccountHeader title="Password"/>
                    <div className={s.all}>
                        <h2>パスワードを変更して下さい</h2>
                        <div className={s.box}>
                            <input type="text"  placeholder="現在のパスワード" className={s.text} />
                        </div>
                        <h3 className={s.color}>パスワードをお忘れですか？</h3>
                        <p className={s.border}>-------------------------------------------------------------------------------------------</p>
                        <div className={s.box}>
                            <input type="text"  placeholder="新しいパスワード" className={s.text} />
                        </div>
                        <div className={s.box}>
                            <input type="text"  placeholder="もう一度新しいパスワードを入力" className={s.text} />
                        </div>
                        <p className={s.save}>Save</p>
                        <p className={s.logout}>Logout</p>
                    </div>

            </MainLayout>
        </>
    )
}
export default Password;

// import MainLayout from "@/components/MainLayout";
// import AccountHeader from "@/components/AccountHeader";
// import s from "./pwd.module.css";
//
// const Password = (props) => {
//     return (
//         <>
//             <MainLayout>
//                 <AccountHeader title="Password" />
//                 <div className={s.all}>
//                     <h2>パスワードを変更して下さい</h2>
//                     <div className={s.box}>
//                         <input type="text" placeholder="現在のパスワード" className={s.text} />
//                     </div>
//                     <h3 className={s.color}>パスワードをお忘れですか？</h3>
//                     <div className={s.box}>
//                         <input type="text" placeholder="新しいパスワード" className={s.text} />
//                     </div>
//                     <div className={s.box}>
//                         <input type="text" placeholder="もう一度新しいパスワードを入力" className={s.text} />
//                     </div>
//                     <p className={s.save}>Save</p>
//                 </div>
//             </MainLayout>
//         </>
//     );
// };
//
// export default Password;