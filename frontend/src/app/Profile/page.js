'use client'

import React, { useState, useEffect } from 'react';
import s from './profile.module.css';
import MainLayout from "@/components/MainLayout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Edit from '@/app/Profile/edit'
import Link from "next/link";
import Post from "@/components/post";
import ReviewPosts from "@/components/ReviewPost";
import {doc, getDoc, getDocs, updateDoc, where, query, collection} from "firebase/firestore";
import {db, auth} from "@/firebase"
import { onAuthStateChanged } from "firebase/auth";
import {useRouter} from "next/navigation";


const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [focusedTab, setFocusedTab] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [personalColor, setPersonalColor] = useState('');
    const [headerImage, setHeaderImage] = useState('defaultHeader.png');
    const [icon, setIcon] = useState('defaultIcon.png');
    const [username, setUsername] = useState('user ユーザ');
    const [bio, setBio] = useState('ここにBioが表示されます');
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const [isFixed, setIsFixed] = useState(false);
    const [likesPosts, setLikesPosts] = useState([]);
    const router = useRouter();

    // ユーザーの認証状態を監視
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    const handleFocus = (tabName) => setFocusedTab(tabName);

    // const preventScroll = (e) => e.preventDefault();

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };


    const handleSave = async ({ headerImage: newHeader, icon: newIcon, username: newUserName, bio: newBio }) => {
        if (currentUserUid) {
            try {
                const userDocRef = doc(db, "users", currentUserUid);
                await updateDoc(userDocRef, {
                    headerImage: newHeader,
                    icon: newIcon,
                    name: newUserName,
                    bio: newBio
                });
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


    // Firestoreからユーザーデータを取得
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUserUid) {
                try {
                    // Firestoreのユーザーコレクションでuidが一致するものをクエリ
                    const userQuery = query(
                        collection(db, "users"),
                        where("uid", "==", currentUserUid)
                    );
                    const querySnapshot = await getDocs(userQuery);

                    if (!querySnapshot.empty) {
                        // ユーザーが存在する場合
                        querySnapshot.forEach((doc) => {
                            const userData = doc.data();
                            setUserData(userData);
                            setHeaderImage(userData.headerImage || 'defaultHeader.png');
                            setIcon(userData.icon || 'defaultIcon.png');
                            setUsername(userData.name || 'user');
                            setBio(userData.bio || 'ここにBioが表示されます');
                            setPersonalColor(userData.personalColor?.[3] || '');
                        });
                    } else {
                        console.log("ユーザードキュメントが存在しません");
                        console.log("ユーザーUID:", currentUserUid);
                    }
                } catch (error) {
                    console.error("ユーザーデータの取得中にエラーが発生しました: ", error);
                }
            }
        };
        fetchUserData();
    }, [currentUserUid]);


    // FirestoreからLikesデータと対応するPostデータを取得
    useEffect(() => {
        const fetchLikesAndPosts = async () => {
            if (currentUserUid) {
                try {
                    const likesQuery = query(
                        collection(db, "likes"),
                        where("userId", "==", currentUserUid)
                    );
                    const likesSnapshot = await getDocs(likesQuery);
                    const likesData = likesSnapshot.docs.map(doc => doc.data());

                    const postsData = await Promise.all(
                        likesData.map(async (like) => {
                            const postRef = doc(db, "posts", like.postId);
                            const postSnap = await getDoc(postRef);
                            return postSnap.exists() ? { id: postSnap.id, ...postSnap.data() } : null;
                        })
                    );
                    setLikesPosts(postsData.filter(post => post !== null));
                } catch (error) {
                    console.error("Likesデータの取得中にエラーが発生しました: ", error);
                }
            }
        };
        fetchLikesAndPosts();
    }, [currentUserUid]);

    useEffect(() => {
        const handleScroll = () => {
            const tabsContainer = document.querySelector(`.${s.tabsContainer}`);
            if (tabsContainer) {
                const rect = tabsContainer.getBoundingClientRect();
                setIsFixed(rect.top <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <div className={s.headerToTabsContainer}>
                        <div className={s.header}>
                            <img src={headerImage} className={s.headerImage}/>
                        </div>

                        <div className={s.container}>
                            <img src={icon} className={s.profileImage} />
                            <div>
                                <a className={`${s.personal} 
                                ${personalColor === '春' ? s.springText :
                                    personalColor === '夏' ? s.summerText :
                                        personalColor === '秋' ? s.autumnText :
                                            personalColor === '冬' ? s.winterText: ''}`}>
                                    {personalColor ? `${personalColor}` : '未設定'}
                                </a>
                                <button className={s.edit} onClick={handleEditClick}>Edit Profile</button>

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
                                </div>

                                <p className={s.bio}>{bio}</p>
                            </div>

                            <Tabs>
                                <TabList className={`${s.tabsContainer} ${isFixed ? s.fixed : ''}`}>
                                    <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''} ${focusedTab === 'tabThird' ? s.zIndex1 : ''}`} onFocus={() => handleFocus('tabFirst')} tabIndex={0}>Posts</Tab>
                                    <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`} onFocus={() => handleFocus('tabSecond')} tabIndex={0}>Media</Tab>
                                    <Tab className={`${s.tabs} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`} onFocus={() => handleFocus('tabThird')} tabIndex={0}>Likes</Tab>
                                </TabList>

                                <TabPanel>
                                    <article className={s.articleContainer}>
                                        {currentUserUid ? <Post userId={currentUserUid} pageType="profile"/> :
                                            <p>ログインしてください</p>}
                                    </article>
                                    <article className={s.articleContainer}>
                                        {currentUserUid ? <ReviewPosts userId={currentUserUid} pageType="profile"/> :
                                            <p>ログインしてください</p>}
                                    </article>
                                </TabPanel>

                                <TabPanel>
                                    <article><p>media</p></article>
                                </TabPanel>

                                <TabPanel>
                                    <article className={s.articleContainer}>
                                        {likesPosts.length > 0 ? (
                                            likesPosts.map(post => (
                                                <div key={post.id} className={s.likeItem}>
                                                    <h3>{post.name}</h3>
                                                    <p>{post.tweet}</p>
                                                </div>
                                            ))
                                        ) : (<p>いいねがありません</p>)}
                                    </article>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>

                    {showEditModal && (
                        <div className={s.modalOverlay}>
                            <div className={s.modalContent}>
                                <Edit userData={{
                                    headerImage,
                                    icon,
                                    username,
                                    bio
                                }} onSave={handleSave}
                                />
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