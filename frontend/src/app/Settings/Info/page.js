import AccountHeader from "@/components/AccountHeader";
import MainLayout from "@/components/MainLayout";
import s from "./info.module.css"
// import {Sail} from "next/dist/compiled/@next/font/dist/google";

const Page = () => {
    return (
        <>
            <MainLayout>
                <AccountHeader title="Account Information" />
                <div className={s.allContainer}>
                    <div className={s.all}>
                        <container>
                            <h2 className={s.font1}>UserName</h2>
                            <div className={s.content}>
                                <input className={s.box}></input>
                            </div>
                        </container>
                        <container>
                            <h2 className={s.font2}>Email-Address</h2>
                            <div className={s.content}>
                                <input className={s.box2}></input>
                            </div>
                        </container>
                        <div>
                            <button className={s.sakujo}>Delete Account</button>
                            <button className={s.keep}>Save</button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}
export default Page;