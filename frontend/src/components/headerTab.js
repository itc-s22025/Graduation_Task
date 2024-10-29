"use client";

import s from '@/styles/headerTab.module.css';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import Post from "@/components/post";

const HeaderTab = ({ firstTabText, secondTabText, thirdTabText, firstTabContent, secondTabContent, thirdTabContent, additionalFeatures, pageType }) => {
    // state
    const [focusedTab, setFocusedTab] = useState('');

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    // ページタイプに基づいてクラスを決定
    const headerClass = pageType === 'myCosmetics' ? s.headerMyCosmetics : s.headerHome;
    const tabFirst = pageType === 'myCosmetics' ? s.tab1MC : s.tab1Home;
    const tabSecond = pageType === 'myCosmetics' ? s.tab2MC : s.tab2Home;
    const tabThird = pageType === 'myCosmetics' ? s.tab3MC : s.tab3Home;

    return (
        <>
            <Tabs>
                <TabList className={`${s.all} ${headerClass}`}>
                    <ul className={s.ul}>
                        <Tab className={`${s.tabs} ${tabFirst} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''} ${focusedTab === 'tabThird' ? s.zIndex1 : ''}`}
                            onFocus={() => handleFocus('tabFirst')} tabIndex={0}>
                            {firstTabText}
                        </Tab>
                        <Tab className={`${s.tabs} ${tabSecond} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`}
                            onFocus={() => handleFocus('tabSecond')} tabIndex={0}>
                            {secondTabText}
                        </Tab>
                        <Tab className={`${s.tabs} ${tabThird} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`}
                            onFocus={() => handleFocus('tabThird')} tabIndex={0}>
                            {thirdTabText}
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

                <TabPanel>
                    <article>
                        {thirdTabContent}
                    </article>
                </TabPanel>
            </Tabs>

            {/* 追加機能 */}
            {additionalFeatures && (
                <div className={s.additionalFeatures}>
                    {additionalFeatures}
                </div>
            )}
        </>
    );
};

export default HeaderTab;
