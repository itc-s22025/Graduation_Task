import s from '@/styles/header.module.css'

const Header = () => {
    return(
        <>
            <div className={s.all}>
                <ul className={s.ul}>
                    <li className={`${s.li} ${s.tabFirst}`}>Tab1</li>
                    <li className={`${s.li} ${s.tabSecond}`}>Tab2</li>
                    <li className={`${s.li} ${s.tabThird}`}>Tab3</li>
                </ul>
                <button className={s.add}>+</button>
            </div>

        </>
    )
}
export default Header