"use client";

import Image from 'next/image';
import s from './page.module.css';
import {useRouter} from "next/navigation";

const Page = () => {

    const router = useRouter();

    return (
        <>
            <div className={s.all}>
                <Image className={s.image} src="/ハート.png" width={100} height={100} alt="logo"/>
                <p className={s.logo}>Prettie</p>
                <div className={s.container}>
                    <h3 className={s.box1} onClick={() => router.push('/SignUp')}>新しいアカウントを作成</h3>
                    <h3 className={s.box2} onClick={() => router.push('/SignIn')}>サインイン</h3>
                </div>
            </div>
        </>
    )
}

export default Page