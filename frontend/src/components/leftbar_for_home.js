import s from '../styles/leftbar_for_home.module.css';

const LeftBar = () => {
    return(
        <>
            <div className={s.all}>
                <h1 className={s.logo}>LOGO</h1>
                <div className={s.button_container}>
                    <button className={s.button}>Home</button>
                    <button className={s.button}>Search</button>
                    <button className={s.button}>Profile</button>
                    <button className={s.button}>Notifications</button>
                    <button className={s.button}>Settings</button>
                    <button className={s.button}>Keeps</button>
                    <button className={s.button}>Color Diagnosis</button>
                    <button className={s.button}>My Cosmetics</button>
                </div>
            </div>
        </>
    )
}

export default LeftBar