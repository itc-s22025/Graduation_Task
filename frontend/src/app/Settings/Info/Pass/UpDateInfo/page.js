import s from './update.module.css';
import Leftbar_before_home from "@/components/leftbar_before_home";

const UpdateInfo = () => {
    return (
        <>
            <Leftbar_before_home/>
            <div className={s.content}>
                <div className={s.box}>
                    <h2>UserName</h2>
                </div>
                <div className={s.box2}>
                    <h2>UserID</h2>
                </div>
                <div className={s.box3}>
                    <h2>Email</h2>
                </div>
            </div>
            <div className={s.all}></div>
        </>
    )
}
export default UpdateInfo;