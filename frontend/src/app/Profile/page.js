'use client'

import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc} from "firebase/firestore";
import { useRouter } from 'next/navigation';
import s from './profile.module.css';
import MainLayout from "@/components/MainLayout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {useAuth} from "@/app/context/AuthProvider";
import Edit from '@/app/Profile/edit'
import Link from "next/link";
import Post from "@/components/post";
// Firebase
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const db = getFirestore();
    const auth = useAuth();
    const [focusedTab, setFocusedTab] = useState('');
    const [showEditModal, setShowEditModal] = useState(false); // Modal state
    const [personalColor, setPersonalColor] = useState('');

    const [headerImage, setHeaderImage] = useState('defaultHeader.png');
    const [icon, setIcon] = useState('defaultIcon.png');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    // const [userId, setUserId] = useState('');
    const [uid, setUid] = useState('');
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

    const handleSave = async ({ headerImage: newHeader, icon: newIcon, username: newUserName, bio: newBio }) => {
        const user = auth.currentUser;  // 現在のユーザーを取得
        if (user) {
            try {
                // Firestoreのユーザードキュメントを更新
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, {
                    headerImage: newHeader,
                    icon: newIcon,
                    name: newUserName,
                    bio: newBio,
                    // Id: user.id,
                    uid: uid,
                });

                // ステートを更新して即座にUIに反映
                setHeaderImage(newHeader);
                setIcon(newIcon);
                setUsername(newUserName);
                setBio(newBio);

                alert('Profile updated successfully');
            } catch (error) {
                console.error("Error updating document: ", error);
                alert("Error updating profile");
            }
        }
    };

    // Firestoreからデータを取得
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);  // Firestoreからユーザーデータを取得
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                    setHeaderImage(data.headerImage || 'defaultHeader.png');
                    setIcon(data.icon || 'defaultIcon.png');
                    setUsername(data.name || 'user ユーザ');
                    // setUserId(data.id || 'user ID')
                    setUid(data.uid || 'User ID not set');

                    setBio(data.bio || 'ここにBioが表示されます');

                    // Set personal color (extract the fourth character)
                    const personalColor = data.personalColor || '';
                    const personalColorChar = personalColor[3] || ''; // Get the fourth character
                    setPersonalColor(personalColorChar); // Save it in a state variable
                }
            }
        };
        fetchUserData();
    }, [auth, db]);



    return (
        <>
            <MainLayout>

                <div className={s.allContainer}>
                    {/*ヘッダー画像*/}
                    <div className={s.header}>
                        <img src={headerImage} className={s.headerImage}/>
                    </div>

                    {/*main*/}
                    <div className={s.container}>
                        {/*{profileData?.icon && <img src={profileData.icon} alt="Profile Icon" />}*/}
                        <img src={icon} className={s.profileImage} />

                        <div>
                            <a className={`${s.personal} 
                                ${personalColor === '春' ? s.springText :
                                personalColor === '夏' ? s.summerText :
                                    personalColor === '秋' ? s.autumnText :
                                        personalColor === '冬' ? s.winterText: ''}`}>

                                {personalColor ? `${personalColor}` : '未設定'}
                            </a>
                            <button className={s.edit} onClick={handleEditClick}>
                                Edit Profile
                            </button>

                            <div className={s.infoContainer}>
                                <h2 className={s.userName}>{username}</h2>

                                <div className={s.idAndFollow}>
                                    <p className={s.userId}>{uid}</p>


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
                                <article className={s.size}>
                                    <Post />
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
                </div>

            </MainLayout>
        </>
    );
};

export default Profile;