'use client'

import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc} from "firebase/firestore";
import { useRouter } from 'next/navigation';
import s from './profile.module.css';
import MainLayout from "@/components/MainLayout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {useAuth} from "@/app/context/AuthProvider";
import Edit from '@/app/Profile/edit'
import Link from "next/link";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const db = getFirestore();
    const auth = useAuth();
    const [focusedTab, setFocusedTab] = useState('');
    const [showAddTab, setShowAddTab] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Modal state

    const [headerImage, setHeaderImage] = useState('defaultHeader.png');
    const [icon, setIcon] = useState('defaultIcon.png');
    const [username, setUsername] = useState('user ユーザ');
    const [bio, setBio] = useState('ここにBioが表示されます');
    const router = useRouter();

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

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

    const handleSave = ({ headerImage: newHeader, icon: newIcon, username: newUserName, bio: newBio }) => {
        setHeaderImage(newHeader);
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

                <div className={s.allContainer}>
                    {/*ヘッダー画像*/}
                    <div className={s.header}>
                        <img src={headerImage} alt="User icon" className={s.headerImage}/>
                    </div>

                    {/*main*/}
                    <div className={s.container}>
                        {/*{profileData?.icon && <img src={profileData.icon} alt="Profile Icon" />}*/}
                        <img src={icon} alt="icon" className={s.profileImage} />

                        <div>
                            <button className={s.edit} onClick={handleEditClick}>
                                Edit Profile
                            </button>

                            <div className={s.infoContainer}>
                                <h2 className={s.userName}>{username}</h2>

                                <div className={s.idAndFollow}>
                                    <p className={s.userId}>@userID</p>


                                <div className={s.followContainer}>
                                    <Link href="/Profile/Follow" className={s.add}>
                                        <span className={s.follow}><strong>150</strong> Following</span>
                                    </Link>
                                    <Link href="/Profile/Follow" className={s.add}>
                                        <span className={s.follower}><strong>200</strong> Follower</span>
                                    </Link>

                                </div>
                            </div>

                            <p className={s.bio}>{bio}</p>
                        </div>
                    </div>

                    <Tabs>
                        <TabList className={s.tabsContainer}>
                            <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''} ${focusedTab === 'tabThird' ? s.zIndex1 : ''}`} onFocus={() => handleFocus('tabFirst')} tabIndex={0}>Posts</Tab>
                            <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`} onFocus={() => handleFocus('tabSecond')} tabIndex={0}>Media</Tab>
                            <Tab className={`${s.tabs} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`} onFocus={() => handleFocus('tabThird')} tabIndex={0}>Likes</Tab>
                        </TabList>

                        <TabPanel>
                            <article>
                                <p>posts</p>
                            </article>
                        </TabPanel>

                        <TabPanel>
                            <article>
                                <p>media</p>
                            </article>
                        </TabPanel>

                        <TabPanel>
                            <article>
                                <p>third</p>
                            </article>
                        </TabPanel>
                    </Tabs>


                    {/* Edit Profile Modal */}
                    {showEditModal && (
                        <div className={s.modalOverlay}>
                            <div className={s.modalContent}>
                                <Edit onSave={handleSave} />
                                <button onClick={handleCloseEditModal} className={s.closeButton}>Close</button>
                            </div>
                        </div>
                    )}
                </div>

            </MainLayout>
        </>
    );
};

export default Profile;
