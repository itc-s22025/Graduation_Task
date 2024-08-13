"use client";

import s from '@/styles/header.module.css'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Post from "@/components/post";
import {useState} from "react";

const Header = () => {
    //state
    const [focusedTab, setFocusedTab] = useState('');

    const handleFocus = (tabName) => {
    setFocusedTab(tabName);
    };

    return(
        <>
            <Tabs>
                <TabList className={s.all}>
                        <ul className={s.ul}>
                            <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : '' } ${focusedTab === 'tabThird' ? s.zIndex1 : '' }`}
                                 onFocus={() => handleFocus('tabFirst')} tabIndex={0}>Tab1</Tab>
                            <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`}
                                 onFocus={() => handleFocus('tabSecond')} tabIndex={0}>Tab2</Tab>
                            <Tab className={`${s.tabs} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`}
                                 onFocus={() => handleFocus('tabThird')} tabIndex={0}>Tab3</Tab>
                        </ul>
                        <button className={s.add}>+</button>
                </TabList>

                {/*tab-first*/}
                <TabPanel>
                    <article>
                        <Post />
                    </article>
                </TabPanel>

                {/*tab-second*/}
                <TabPanel>
                    <article>
                        <p>second</p>
                    </article>
                </TabPanel>

                {/*tab-third*/}
                <TabPanel>
                    <article>
                        <p>third</p>
                    </article>
                </TabPanel>
            </Tabs>
        </>
    )
}
export default Header