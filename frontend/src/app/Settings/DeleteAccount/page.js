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
                    <div className={s.explanationContainer}>
                        <h2>アカウントの削除プロセスを開始します。</h2>
                        <p >・ユーザ名、ユーザID、公開プロフィールは本サイトに表示されなくなります。</p>
                        <p>・GoogleやBingなどの検索エンジンに一部のアカウント情報が残っている場合があります。</p>
                    </div>
                    <div className={s.box}>
                        <Link href='/Settings/DeleteAccount/AuthenticationCode' className={s.deleteButton}>Disable</Link>
                    </div>
                </div>
            </MainLayout>

        </>
    )
}
export default DeleteAccount