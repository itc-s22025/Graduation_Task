"use client";

import MainLayout from "@/components/MainLayout";
import s from './page.module.css'
import { useRouter} from "next/navigation";
import AccountHeader from "@/components/AccountHeader";
import Link from "next/link";

const DeleteAccount = () => {
    const router = useRouter();

    const handleBackClick = () => {
        router.back()
    }

    return(
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <AccountHeader title="Delete Account" />
                    <div className={s.content}>

                        <div className={s.font}>
                            <h2>アカウントの削除プロセスを開始！</h2>
                        </div>
                            <div className={s.font2}>
                                <p>・サイトから現在のアカウントが表示されなくなります。</p>
                                <p>・検索エンジンに一部のアカウント情報が残っている場合があります。</p>
                            </div>
                    </div>

                    </div>
                    <div className={s.button}>
                        <Link href='/Settings/DeleteAccount/AuthenticationCode' className={s.deleteButton}>Next</Link>
                </div>
            </MainLayout>

        </>
    )
}
export default DeleteAccount