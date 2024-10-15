"use client";

import s from '@/styles/header.module.css';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useState } from "react";
import AddTab from "@/components/addTab";
import addTab from "@/components/addTab";

const Header = ({ firstTabText, secondTabText, thirdTabText, firstTabContent, additionalFeatures, pageType }) => {
    // state
    const [focusedTab, setFocusedTab] = useState('');
    const [showAddTab, setShowAddTab] = useState(false);

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    const handleAddClick = () => {
        console.log("handleAddClick");
        setShowAddTab(true); // AddTabを表示
    };

    const handleCloseAddTab = () => {
        setShowAddTab(false); // AddTabを非表示
    };

    // ページタイプに基づいてクラスを決定
    const headerClass = pageType === 'myCosmetics' ? s.headerMyCosmetics : s.headerHome;
    const tabFirst = pageType === 'myCosmetics' ? s.tab1MC : s.tab1Home;
    const tabSecond = pageType === 'myCosmetics' ? s.tab2MC : s.tab2Home;
    const tabThird = pageType === 'myCosmetics' ? s.tab3MC : s.tab3Home;
    const addTab = pageType === 'myCosmetics' ? s.addTabMC : s.addTabHome;

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
                    <button className={`${s.add} ${addTab}`} onClick={handleAddClick}>+</button>
                </TabList>


                {/* Tab Panels */}
                <TabPanel>
                    <article>
                        {firstTabContent}
                    </article>
                </TabPanel>

                <TabPanel>
                    <article>
                        <p>second</p>
                    </article>
                </TabPanel>

                <TabPanel>
                    <article>
                        <p>third</p>
                    </article>
                </TabPanel>
            </Tabs>

            {/* タブ追加ボタン押したとき */}
            {showAddTab && (
                <div className={s.addTabOverlay}>
                    <div className={s.addTabContent}>
                        <AddTab pageType={pageType} /> {/* pageTypeを渡す */}
                        <button onClick={handleCloseAddTab} className={s.buttonCancel}>Cancel</button>
                    </div>
                </div>
            )}

            {/* 追加機能 */}
            {additionalFeatures && (
                <div className={s.additionalFeatures}>
                    {additionalFeatures}
                </div>
            )}
        </>
    );
};

export default Header;
