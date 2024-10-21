"use client";

import MainLayout from "@/components/MainLayout";
import s from './page.module.css'
import { useRouter} from "next/navigation";
import AccountHeader from "@/components/AccountHeader";

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
                        <p>アカウントの削除プロセスを開始します。</p>
                        <p>ユーザ名、ユーザID、公開プロフィールは本サイトに表示されなくなります。</p>
                        <p>GoogleやBingなどの検索エンジンに一部のアカウント情報が残っている場合があります。</p>
                    </div>
                    <button type="button">アカウント削除</button>
                </div>
            </MainLayout>

        </>
    )
}
export default DeleteAccount