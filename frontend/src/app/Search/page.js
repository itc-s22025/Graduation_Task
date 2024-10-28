'use client';

import MainLayout from "@/components/MainLayout";
import React from "react";
import s from './search.module.css'
import AccountHeader from "@/components/AccountHeader";


const Search = () => {
    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <AccountHeader title="Search"/>
                    <div className={s.searchContainer}>
                    <img alt="search_black" src="/search_black.png" className={s.searchImg}/>
                    <input type="search" className={s.searchBox} placeholder="search..."/>
                    <button type="button" className={s.searchButton}>Search</button>

                    </div>
                    {/*</div>*/}
                </div>
            </MainLayout>

        </>
    )
}
export default Search;