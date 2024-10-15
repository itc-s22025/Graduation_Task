import MainLayout from "@/components/MainLayout";
import React from "react";
import s from './search.module.css'


const Search = () => {
    return (
        <>
            <MainLayout>
                <div className={s.header}>
                    <div className={s.contener}>
                        <input type="text" placeholder="キーワード検索" className={s.content} />
                    </div>
                </div>
            </MainLayout>

        </>
    )
}
export default Search;