'use client';

import React, { useState, useEffect } from 'react';
import s from '@/app/Profile/profile.module.css';
import MainLayout from "@/components/MainLayout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Edit from "@/app/Profile/edit";
import Link from "next/link";
import {  query, where, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, getDocs} from "firebase/firestore";
import {db, auth} from "@/firebase";
import {onAuthStateChanged} from "firebase/auth";
import Post from "@/components/post";
import PostButton from "@/components/post_button";

const Profile = ({ imageUrl, params }) => {
    const [userData, setUserData] = useState(null);
    const [focusedTab, setFocusedTab] = useState('');
    const [personalColor, setPersonalColor] = useState('');
    const [headerImage, setHeaderImage] = useState('defaultHeader.png');
    const [icon, setIcon] = useState('defaultIcon.png');
    const [username, setUsername] = useState('');
    const [displayId, setDisplayId] = useState('');
    const [bio, setBio] = useState(null);
    const [isFixed, setIsFixed] = useState(false);
    const [likesPosts, setLikesPosts] = useState([]);

    const [isFollowing, setIsFollowing] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const userId = params.userId;

    // ユーザーの認証状態を監視,currentUserUidにログインユーザのuidを入れる
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUserUid(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    const preventScroll = (e) => e.preventDefault();

    //paramsのuserIdに基づくユーザデータをセット
    useEffect(() => {
        if (userId) {   //もしuserIdが空でなければ
            const fetchUserData = async () => {
                try {
                    const userDocRef = doc(db, "users", userId);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(data);
                        setHeaderImage(data.headerImage);
                        setIcon(data.icon || 'user_default.png');
                        setUsername(data.name || 'user');
                        setDisplayId(data.displayId || 'unknown')
                        setBio(data.bio || 'ここにBioが表示されます');
                        setPersonalColor(data.personalColor?.[3] || '');
                    }
                } catch (error) {
                    console.error("ユーザーデータの取得に失敗しました", error);
                }
            };
            fetchUserData();
        }
    }, [userId, db]);

    // ユーザのポストをフェッチ
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (userId) {
                const q = query(collection(db, "posts"), where("uid", "==", userId));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUserPosts(postsData);
            }
        };
        fetchUserPosts();
    }, [userId, db]);

    // Check following status
    useEffect(() => {
        const checkFollowingStatus = async () => {
            const user = auth.currentUser;
            if (user && userId) {
                const currentUserRef = doc(db, "users", user.uid);
                const currentUserDoc = await getDoc(currentUserRef);
                if (currentUserDoc.exists()) {
                    const currentUserData = currentUserDoc.data();
                    setIsFollowing(currentUserData.following?.includes(userId));
                }
            }
        };
        checkFollowingStatus();
    }, [auth, userId, db]);

    const [showEditModal, setShowEditModal] = useState(false);

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    const handleEditClick = () => {
        setShowEditModal(true);
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
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

    const [currentUserUid, setCurrentUserUid] = useState(null);

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
        <MainLayout>

            <div className={s.allContainer}>
                <div className={s.headerToTabsContainer}>
                    {/*header*/}
                    <div className={s.header}>
                        <img src={headerImage} className={s.headerImage}/>
                    </div>

                    <div className={s.container}>
                        <img src={icon} className={s.profileImage} />
                        <div>
                            <a className={`${s.personal} 
                                ${personalColor === '春' ? s.springText : personalColor === '夏' ? s.summerText : personalColor === '秋' ? s.autumnText : personalColor === '冬' ? s.winterText : ''}`}>
                                {personalColor ? `${personalColor}` : '未設定'}
                            </a>
                            <button className={s.edit} onClick={handleEditClick}>Edit Profile</button>

                            <div className={s.infoContainer}>
                                <h2 className={s.userName}>{username || 'ユーザ名未設定'}</h2>
                                <div className={s.idAndFollow}>
                                    <p className={s.userId}>@{displayId || 'unknown'}</p>
                                    <div className={s.followContainer}>
                                        <Link href={`/Profile/${userId}/Follow`} className={s.add}>
                                            <span className={s.follow}><strong>{userData?.following?.length || 0}</strong> Following</span>
                                        </Link>
                                        <Link href={`/Profile/${userId}/Follow`} className={s.add}>
                                            <span className={s.follower}><strong>{userData?.followers?.length || 0}</strong> Followers</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/*<button className={s.followButton} onClick={handleFollowToggle}>*/}
                            {/*    {isFollowing ? 'Unfollow' : 'Follow'}*/}
                            {/*</button>*/}
                            <p className={s.bio}>{bio || '自己紹介未設定'}</p>
                        </div>


                    <Tabs>
                        <TabList className={`${s.tabsContainer} ${isFixed ? s.fixed : ''}`}>
                            <Tab
                                className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''} ${focusedTab === 'tabThird' ? s.zIndex1 : ''}`}
                                onFocus={() => handleFocus('tabFirst')} tabIndex={0}>Posts</Tab>
                            <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`} onFocus={() => handleFocus('tabSecond')} tabIndex={0}>Media</Tab>
                            <Tab className={`${s.tabs} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`} onFocus={() => handleFocus('tabThird')} tabIndex={0}>Likes</Tab>
                        </TabList>

                       <TabPanel>
                           <article className={s.articleContainer}>
                               <div>
                                   {userPosts.length > 0 ? (userPosts
                                           // .filter(post => post.uid === userId) // uidがuserIdと一致するポストだけをフィルタリング
                                           .map((post) => (
                                               <Post key={post.id} ownPost={post} pageType="profile"/>
                                           ))) : (<p>投稿がありません</p>)}
                               </div>
                           </article>
                       </TabPanel>


                        <TabPanel>
                            <article>
                                <p>media</p>
                            </article>
                        </TabPanel>

                        <TabPanel>
                            <article>
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
                        <Edit onSave={handleSave} />
                        <button onClick={handleCloseEditModal} className={s.closeButton}>Close</button>
                    </div>
                </div>
            )}

                <PostButton/>
        </div>

        </MainLayout>
    );
};

export default Profile;
