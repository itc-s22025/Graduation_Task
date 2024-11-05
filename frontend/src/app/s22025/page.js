"use client";

import s from './page.module.css'
import MyCosmeticsHeaderTab from "@/components/myCosmeticsHeaderTab";
import MainLayout from "@/components/MainLayout";


const Test = () => {
    return(
        <>
            <MainLayout>
                <MyCosmeticsHeaderTab/>
                <h1 className={s.hello}>hello test</h1>
            </MainLayout>
        </>
    )
}

export default Test