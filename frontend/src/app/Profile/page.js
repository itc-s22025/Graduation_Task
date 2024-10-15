'use client'

import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc} from "firebase/firestore";
import { useRouter } from 'next/navigation';
import s from './profile.module.css';
import MainLayout from "@/components/MainLayout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Post from "@/components/post";
import AddTab from "@/components/addTab";
import Edit from './edit';
import PostButton from "@/components/post_button";
import {useAuth} from "@/app/context/AuthProvider";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const db = getFirestore();
    const auth = useAuth();
    const [focusedTab, setFocusedTab] = useState('');
    const [showAddTab, setShowAddTab] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Modal state

    const [icon, setIcon] = useState('defaultIcon.png');
    const [username, setUsername] = useState('ユーザー名');
    const [bio, setBio] = useState('ここにBioが表示されます');
    const router = useRouter();

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    // const handleAddClick = () => {
    //     setShowAddTab(true);
    // }

    const handleCloseAddTab = () => {
        setShowAddTab(false);
    }


    const preventScroll = (e) => {
        e.preventDefault();
    }

    const handleEditClick = () => {
        setShowEditModal(true); // Show modal
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false); // Close modal
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
    }

    // const handleSave = (newIcon, newUserName, newBio) => {
    //         setIcon(newIcon);
    //         setUsername(newUserName);
    //         setBio(newBio);
    // }
    const handleSave = ({ icon: newIcon, username: newUserName, bio: newBio }) => {
        setIcon(newIcon);
        setUsername(newUserName);
        setBio(newBio);
    }


    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfileData(docSnap.data());
                }
            }
        };
        fetchUserData();
    }, [db, auth]);




    return (
        <>
            <MainLayout>
                <div className={s.header}></div>
                <div className={s.container}>
                    <div className={s.profileImage}>
                        {/*{profileData?.icon && <img src={profileData.icon} alt="Profile Icon" />}*/}
                        <img src={icon} alt="User Icon" />
                    </div>

                    <div className={s.userInfo}>
                        <button className={s.edit} onClick={handleEditClick}>
                            Edit Profile
                        </button>
                        <h2 className={s.userName}>{username}</h2>
                        <a className={s.userId}>@ユーザーID</a>

                        <div className={s.followInfo}>
                            <span>フォロー中 <strong>150</strong></span>
                            <span>フォロワー <strong>200</strong></span>
                        </div>

                            <a className={s.bio}>{bio}</a>
                        </div>
                    </div>
                    <div className={s.content}>
                    <PostButton/>
                </div>
            </MainLayout>

            <Tabs>
                <div className={s.adder}>
                    <TabList className={s.all}>
                        <ul className={s.ul}>
                            <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''} ${focusedTab === 'tabThird' ? s.zIndex1 : ''}`} onFocus={() => handleFocus('tabFirst')} tabIndex={0}>Now</Tab>
                            <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`} onFocus={() => handleFocus('tabSecond')} tabIndex={0}>Tab2</Tab>
                            <Tab className={`${s.tabs} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`} onFocus={() => handleFocus('tabThird')} tabIndex={0}>Tab3</Tab>
                        </ul>
                    </TabList>

                    <TabPanel>
                        <div className={s.adder2}>
                            <article>
                                <Post />
                            </article>
                        </div>
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
                </div>
            </Tabs>



            {showAddTab && (
                <div className={s.addTabOverlay}>
                    <div className={s.addTabContent}>
                        <AddTab />
                        <button onClick={handleCloseAddTab} className={s.buttonCansel}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className={s.modalOverlay}>
                    <div className={s.modalContent}>
                        <Edit onSave={handleSave} />
                        {/*<Edit userData={profileData} onClose={handleSave} />*/}
                        <button onClick={handleCloseEditModal} className={s.closeButton}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
