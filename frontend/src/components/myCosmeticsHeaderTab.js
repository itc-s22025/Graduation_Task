"use client"

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import s from "@/styles/myCosmeticsHeaderTab.module.css";

const MyCosmeticsHeaderTab = ({ firstTabText, secondTabText, firstTabContent, secondTabContent, pageType }) => {

    // state
    const [focusedTab, setFocusedTab] = useState('');

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    // ページタイプに基づいてクラスを決定
    const tabFirst = pageType === 'myCosmetics' ? s.tab1MC : s.tab1Home;
    const tabSecond = pageType === 'myCosmetics' ? s.tab2MC : s.tab2Home;

    return(
        <>
            <Tabs>
                <TabList className={s.all}>
                    <ul className={s.ul}>
                        <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''}`}
                             onFocus={() => handleFocus('tabFirst')} tabIndex={0}>
                            {firstTabText}
                        </Tab>
                        <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`}
                             onFocus={() => handleFocus('tabSecond')} tabIndex={0}>
                            {secondTabText}
                        </Tab>
                    </ul>
                </TabList>


                {/* Tab Panels */}
                <TabPanel>
                    <article>
                        {firstTabContent}
                    </article>
                </TabPanel>

                <TabPanel>
                    <article>
                        {secondTabContent}
                    </article>
                </TabPanel>

            </Tabs>

            {/* 追加機能 */}
            {/*{additionalFeatures && (*/}
            {/*    <div className={s.additionalFeatures}>*/}
            {/*        {additionalFeatures}*/}
            {/*    </div>*/}
            {/*)}*/}

        </>
    )
}

export default MyCosmeticsHeaderTab;