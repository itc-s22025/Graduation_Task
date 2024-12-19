'use client';

import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import s from '../styles/union.module.css';
import { useAuth } from "@/app/context/AuthProvider";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const UnionPage = () => {
    const [focusedTab, setFocusedTab] = useState('tabFirst');
    const auth = useAuth();
    const router = useRouter();
    const userId = auth.currentUser?.uid;

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    const handleTabClick = (tab) => {
        if (tab === 'tabFirst') {
            router.push(`/Profile/${userId}/Following/Follower`);
        } else if (tab === 'tabSecond') {
            router.push(`/Profile/${userId}/Following`);
        }
    };

    if (!auth.currentUser) {
        return <p>ログインが必要です。</p>;
    }

    return (
        <Tabs className={s.allContainer}>
            <TabList className={s.all}>
                <ul className={s.ul}>
                    <Tab
                        className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''}`}
                        onFocus={() => handleFocus('tabFirst')}
                        onClick={() => handleTabClick('tabFirst')}
                        tabIndex={0}
                    >
                        Following
                    </Tab>
                    <Tab
                        className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`}
                        onFocus={() => handleFocus('tabSecond')}
                        onClick={() => handleTabClick('tabSecond')}
                        tabIndex={0}
                    >
                        Followers
                    </Tab>
                </ul>
            </TabList>
        </Tabs>
    );
};

export default UnionPage;