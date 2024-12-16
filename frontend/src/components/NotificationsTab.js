"use client";

import s from '@/styles/NotificationsTab.module.css';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";


const Tweet = () => {
    const [focusedTab, setFocusedTab] = useState('tabFirst');
    const router = useRouter();

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    const handleTabClick = (tab) => {
        if (tab === 'tabFirst') {
            router.push('../Notifications');
        } else if (tab === 'tabSecond') {
            router.push('../Notifications/Following');
        }
    }

    return (
        <>

            <Tabs className={s.allContainer}>
                <TabList className={s.all}>
                    <ul className={s.ul}>
                        <Tab
                            className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''}`}
                            onFocus={() => handleFocus('tabFirst')}
                            onClick={() =>  handleTabClick('tabFirst')}
                            tabIndex={0}>ALL
                        </Tab>

                        <Tab
                            className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`}
                            onFocus={() => handleFocus('tabSecond')}
                            onClick={() => handleTabClick('tabSecond')}
                            tabIndex={0}>Following
                        </Tab>

                     </ul>
                </TabList>

                <TabPanel>
                    <article>
                    </article>
                </TabPanel>

                <TabPanel>
                    <article>
                    </article>
                </TabPanel>
            </Tabs>

        </>
    );
};

export default Tweet;
