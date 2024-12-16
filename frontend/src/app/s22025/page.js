"use client";

import s from './page.module.css'
import MyCosmeticsHeaderTab from "@/components/myCosmeticsHeaderTab";
import MainLayout from "@/components/MainLayout";
import FirstLayout from "@/components/FirstLayout"
import ColorAnalyzePage from "@/components/colorAnalyze";


const Test = () => {
    return(
        <>
            {/*<FirstLayout>*/}
                {/*<MyCosmeticsHeaderTab/>*/}
                {/*<h1 className={s.hello}>hello test</h1>*/}
            {/*</FirstLayout>*/}
            <ColorAnalyzePage/>
        </>
    )
}

export default Test