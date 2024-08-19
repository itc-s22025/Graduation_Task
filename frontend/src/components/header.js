"use client";

import s from '@/styles/header.module.css'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Post from "@/components/post";
import {useState} from "react";
import AddTab from "@/components/addTab";

const Header = () => {
    //state
    const [focusedTab, setFocusedTab] = useState('');
    const [showAddTab, setShowAddTab] = useState(false);

    const handleFocus = (tabName) => {
    setFocusedTab(tabName);
    };

    const handleAddClick = () => {
        console.log("handleAddClick");
        setShowAddTab(true); // AddTabを表示
    }

    const handleCloseAddTab = () => {
        setShowAddTab(false); // AddTabを非表示
    }

    return(
        <>
            <Tabs>
                <TabList className={s.all}>
                        <ul className={s.ul}>
                            <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : '' } ${focusedTab === 'tabThird' ? s.zIndex1 : '' }`}
                                     onFocus={() => handleFocus('tabFirst')} tabIndex={0}>Now</Tab>
                            <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`}
                                 onFocus={() => handleFocus('tabSecond')} tabIndex={0}>Tab2</Tab>
                            <Tab className={`${s.tabs} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`}
                                 onFocus={() => handleFocus('tabThird')} tabIndex={0}>Tab3</Tab>
                        </ul>
                        <button className={s.add} onClick={handleAddClick}>+</button>
                </TabList>

                {/*tab-first*/}
                <TabPanel>
                    <article>
                        <p>first</p>
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

            {/*タブ追加ボタン押したとき*/}
             {showAddTab && (
                <div className={s.addTabOverlay}>
                    <div className={s.addTabContent}>
                        <AddTab />
                        <button onClick={handleCloseAddTab} className={s.buttonCansel}>Cansel</button>
                    </div>
                </div>
            )}
        </>
    )
}
export default Header