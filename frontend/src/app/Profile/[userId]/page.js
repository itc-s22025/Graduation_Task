'use client';

import React, { useState, useEffect } from 'react';
import s from '@/app/Profile/profile.module.css';
import MainLayout from "@/components/MainLayout";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Edit from "@/app/Profile/edit";
import Link from "next/link";
import { query, where, doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, getDocs, orderBy} from "firebase/firestore";
import {db, auth} from "@/firebase";
import {onAuthStateChanged} from "firebase/auth";
import Post from "@/components/post";
import {useParams, useRouter} from "next/navigation";
import {use} from 'react';

const Profile = ({ imageUrl, params }) => {
    const router = useRouter()

    const resolvedParams = use(params);
    const userId = resolvedParams.userId;
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

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
        if (userId) {
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
                        setDisplayId(data.displayId || 'unknown');
                        setBio(data.bio || 'ここにBioが表示されます');
                        setPersonalColor(data.personalColor?.[3] || '');
                    }
                } catch (error) {
                    console.error("ユーザーデータの取得に失敗しました", error);
                }
            };
            fetchUserData();
        }
    }, [userId]);


    // ユーザのポストをフェッチ
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (userId) {
                const q = query(collection(db, "posts"), where("uid", "==", userId), orderBy("timestamp", "desc"));
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

    const handleFollowToggle = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const currentUserRef = doc(db, "users", user.uid);
                const otherUserRef = doc(db, "users", userId);

                // Firestoreデータの更新
                await Promise.all([
                    updateDoc(currentUserRef, {
                        following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
                    }),
                    updateDoc(otherUserRef, {
                        followers: isFollowing ? arrayRemove(user.uid) : arrayUnion(user.uid),
                    }),
                ]);

                // ローカル状態の即時反映
                setIsFollowing(!isFollowing);
                setUserData((prevUserData) => ({
                    ...prevUserData,
                    followers: isFollowing
                        ? prevUserData.followers.filter((follower) => follower !== user.uid)
                        : [...prevUserData.followers, user.uid],
                }));
            } catch (error) {
                console.error("フォロー/アンフォローに失敗しました", error);
            }
        }
    };


    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    const [showEditModal, setShowEditModal] = useState(false);
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

                // Firebase にプロフィールを更新
                await updateDoc(userDocRef, {
                    headerImage: newHeader,
                    icon: newIcon,
                    name: newUserName,
                    bio: newBio
                });

                // 更新後、ユーザーのローカル状態を即座に更新
                setHeaderImage(newHeader);
                setIcon(newIcon);
                setUsername(newUserName);
                setBio(newBio);

                // アイコンを全てのポストにも適用
                const userPostsRef = query(collection(db, "posts"), where("uid", "==", currentUserUid));
                const postsSnapshot = await getDocs(userPostsRef);
                const postUpdates = postsSnapshot.docs.map(postDoc =>
                    updateDoc(postDoc.ref, {
                        icon: newIcon
                    })
                );
                await Promise.all(postUpdates);

                alert('Profile updated successfully');
            } catch (error) {
                console.error("Error updating document: ", error);
                alert("Error updating profile");
            }
        }
    };

    const handleImageClick = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageUrl('');
    }



    const [currentUserUid, setCurrentUserUid] = useState(null);

    // FirestoreからLikesデータと対応するPostデータを取得
    useEffect(() => {
        const fetchLikesAndPosts = async () => {
            if (userId) { // userIdが利用可能であれば、userIdに関連するlikesを取得
                try {
                    // `userId`に基づくlikesを取得
                    const likesQuery = query(
                        collection(db, "likes"),
                        where("userId", "==", userId)  // 現在のユーザーではなく、[userId]を使用
                    );
                    const likesSnapshot = await getDocs(likesQuery);
                    const likesData = likesSnapshot.docs.map(doc => doc.data());

                    // likesデータに基づいて対応するポストデータを取得
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
    }, [userId]);  // `userId`が変更されたときに実行


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
                        <img
                            src={headerImage}
                            className={s.headerImage}
                            onClick={() => handleImageClick(headerImage)}
                        />
                    </div>

                    <div className={s.container}>
                        <img
                            src={icon}
                            className={s.profileImage}
                            onClick={() => handleImageClick(icon)}
                        />
                        <div>
                            <a className={`${s.personal}
                                ${personalColor === '春' ? s.springText : personalColor === '夏' ? s.summerText : personalColor === '秋' ? s.autumnText : personalColor === '冬' ? s.winterText : ''}`}>
                                {personalColor ? `${personalColor}` : '未設定'}
                            </a>
                            {/* Profile Edit/Follow Button Toggle */}
                            {currentUserUid === userId ? (
                                <button className={s.edit} onClick={handleEditClick}>Edit Profile</button>
                            ) : (
                                <button className={s.followButton} onClick={handleFollowToggle}>
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}

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
                                           .map((post) => (
                                               <Post key={post.id} ownPost={post} pageType="profile"/>
                                           ))) : (<p>投稿がありません</p>)}
                               </div>
                           </article>
                       </TabPanel>


                        <TabPanel>
                            <article className={s.imageArticleContainer}>
                                {userPosts.length > 0 ? (userPosts.filter(post => post.imageUrl) // imageUrl が null または undefined でない投稿をフィルタリング
                                    .map((post) => (
                                        <div key={post.id}>
                                            {post.imageUrl && <img src={post.imageUrl} alt="Post image" className={s.postImage} />}
                                        </div>
                                    ))) : (<p>投稿がありません</p>)}
                            </article>
                        </TabPanel>


                        <TabPanel>
                            <article className={s.likesArticleContainer}>
                                {likesPosts.length > 0 ? (
                                    likesPosts.map(post => (
                                        <div key={post.id}>
                                            <Post key={post.id} ownPost={post} pageType="profile"/>
                                        </div>
                                    ))
                                ) : (<p>いいねがありません</p>)}
                            </article>
                        </TabPanel>
                    </Tabs>
                </div>
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

            {isModalOpen && (
                <div className={s.modal} onClick={closeModal}>
                    <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
                        <img src={modalImageUrl} alt="Full screen" className={s.fullScreenImage} />
                    </div>
                </div>
            )}

        </MainLayout>
    );
};

export default Profile;