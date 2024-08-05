import Image from 'next/image';
import s from './First.module.css';

const Page = () => {
    return (
        <>
            <div className={s.all}>
                <Image className={s.image} src="/ハート.png" width={100} height={100} alt="logo"/>
                <h2 className={s.logo}>LOGO</h2>
                <div className={s.container}>
                    <h3 className={s.box1}>新しいアカウント作成</h3>
                    <h3 className={s.box2}>サインイン</h3>
                </div>
            </div>
        </>
    )
}

export default Page