"use client"

import MainLayout from "../../../components/MainLayout";
import s from './follower.module.css';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import AccountHeader from "@/components/AccountHeader";
import Post from "@/app/Post/page";
import {useState} from "react";

const FollowPage = () => {
    const [focusedTab, setFocusedTab] = useState('tabFirst');

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    return (
        <>
        <MainLayout>
            <TabList>
                <Tabs>
                    <AccountHeader/>
                    <div className={s.all}>
                        <ul className={s.ul}>
                            <Tab
                                className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''}`}
                                onClick={() => handleFocus('tabFirst')}
                            >
                                Followers
                            </Tab>
                            <Tab
                                className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabFirst' ? s.zIndex1 : ''}`}
                                onClick={() => handleFocus('tabSecond')}
                            >
                                Following
                            </Tab>
                        </ul>
                    </div>
                </Tabs>
            </TabList>

            <TabPanel>
                <article>
                    <p>first</p>
                </article>
            </TabPanel>

            <TabPanel>
                <article>
                    <p>second</p>
                </article>
            </TabPanel>

        </MainLayout>

        </>
    )
}

export default FollowPage;