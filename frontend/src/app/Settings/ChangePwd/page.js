import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";
import s from "./pwd.module.css";

const Password = (props) => {
    return (
        <>
            <MainLayout>
                <AccountHeader title="Password"/>
                    <div className={s.all}>
                        <h1>Password</h1>
                    </div>
            </MainLayout>
        </>
    )
}
export default Password;