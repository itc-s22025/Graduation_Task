'use client';

import React, { useState, useEffect } from 'react';
import {
    getFirestore,
    query,
    where,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    addDoc,
    collection,
    getDocs
} from "firebase/firestore";
import { useAuth } from "@/app/context/AuthProvider";
import s from './Aot.module.css';
import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useRouter } from "next/navigation";

const OtherUserProfile = ({ imageUrl }) => {
    const router = useRouter();
    const [focusedTab, setFocusedTab] = useState('');
    const [userData, setUserData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const db = getFirestore();
    const auth = useAuth();

    // Set userId from query
    useEffect(() => {
        if (router.query?.userId) {
            const { userId } = router.query;
            setUserId(userId);  // Set the userId correctly
        }
    }, [router.query]);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const docRef = doc(db, "users", userId);  // Fixed: use correct reference
                    const docSnap = await getDoc(docRef);  // Fetch user data
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log("No such user");
                    }
                } catch (error) {
                    console.error("Failed to fetch user data", error);
                }
            }
        };
        fetchUserData();
    }, [userId, db]);

    // Fetch user posts
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (userId) {
                const q = query(collection(db, "posts"), where("uid", "==", userId));  // Fetch posts by userId
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

    const handleFocus = (tabName) => {
        setFocusedTab(tabName);
    };

    const handleFollowToggle = async () => {
        const user = auth.currentUser;
        if (user) {
            const currentUserRef = doc(db, "users", user.uid);
            const otherUserRef = doc(db, "users", userId);

            await updateDoc(currentUserRef, {
                following: isFollowing ? arrayRemove(userId) : arrayUnion(userId)
            });

            await updateDoc(otherUserRef, {
                followers: isFollowing ? arrayRemove(user.uid) : arrayUnion(user.uid)
            });

            setIsFollowing(!isFollowing);
        }
    };

    const handleCreatePost = async () => {
        try {
            const postDocRef = await addDoc(collection(db, "posts"), {
                imageUrl: imageUrl,
                uid: auth.currentUser.uid
            });

            const postId = postDocRef.id;
            console.log("新しいポストのID:", postId);
        } catch (error) {
            console.error("情報の取得に失敗しました", error);
        }
    };

    return (
        <MainLayout>
            <div className={s.allContainer}>
                <div className={s.header}>
                    <img src={userData?.headerImage || 'defaultHeader.png'} className={s.headerImage} />
                </div>
                <div className={s.container}>
                    <img src={userData?.icon || 'defaultIcon.png'} className={s.profileImage} />
                    <div>
                        <h2 className={s.userName}>{userData?.name || 'ユーザ名未設定'}</h2>
                        <p className={s.userId}>{userId || 'User ID 未設定'}</p>
                        <div className={s.followContainer}>
                            <Link href={`/Profile/${userId}/Follow`} className={s.add}>
                                <span className={s.follow}><strong>{userData?.following?.length || 0}</strong> Following</span>
                            </Link>
                            <Link href={`/Profile/${userId}/Follow`} className={s.add}>
                                <span className={s.follower}><strong>{userData?.followers?.length || 0}</strong> Followers</span>
                            </Link>
                        </div>
                        <button className={s.followButton} onClick={handleFollowToggle}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                        <p className={s.bio}>{userData?.bio || '自己紹介未設定'}</p>
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
                            <div className={s.postsContainer}>
                                {userPosts.map((post) => (
                                    <Link key={post.id} href={`/Profile/${post.uid}/Post/${post.id}`}>
                                        <img src={post.imageUrl} alt="Post Image" className={s.postImage} />
                                    </Link>
                                ))}
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
                            <p>third</p>
                        </article>
                    </TabPanel>
                </Tabs>
            </div>
        </MainLayout>
    );
};

export default OtherUserProfile;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//     getFirestore,
//     query,
//     where,
//     doc,
//     getDoc,
//     updateDoc,
//     arrayUnion,
//     arrayRemove,
//     addDoc,
//     collection,
//     getDocs
// } from "firebase/firestore";
// import { useAuth } from "@/app/context/AuthProvider";
// import s from './Aot.module.css';
// import MainLayout from "@/components/MainLayout";
// import Link from "next/link";
// import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
// import { useRouter } from "next/navigation";

// const OtherUserProfile = ({ imageUrl }) => {
    // const router = useRouter();
    // const [focusedTab, setFocusedTab] = useState('');
    // const [userData, setUserData] = useState(null);
    // const [isFollowing, setIsFollowing] = useState(false);
    // const [userId, setUserId] = useState(null);
    // const [userPosts, setUserPosts] = useState([]);
    // const db = getFirestore();
    // const auth = useAuth();
    //
    // // Set userId from query
    // useEffect(() => {
    //     if (router.query?.userId) {
    //         setUserId(userId);
    //         const { userId } = router.query;
    //         setUserId(userId);
    //     }
    // }, [router.query]);
    //
    // // Fetch user data
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         if (userId) {
    //             try {
    //                 const docRef = doc(db, "users", userId);
    //                 const docSnap = await getDoc(userRef);
    //                 if (docSnap.exists()) {
    //                     setUserData(docSnap.data());
    //
    //
    //                 } else {
    //                     console.log("No such user");
    //                 }
    //             } catch (error) {
    //                 console.error("Failed to fetch user data", error);
    //             }
    //         }
    //     };
    //     fetchUserData();
    // }, [userId]);
    //
    // // Fetch user posts
    // useEffect(() => {
    //     const fetchUserPosts = async () => {
    //         if (userId) {
    //             const q = query(collection(db, "posts"), where("uid", "==", userId));
    //             const querySnapshot = await getDocs(q);
    //             const postsData = querySnapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 ...doc.data()
    //             }));
    //             setUserPosts(postsData);
    //         }
    //     };
    //     fetchUserPosts();
    // }, [userId]);
    //
    // // Check following status
    // useEffect(() => {
    //     const checkFollowingStatus = async () => {
    //         const user = auth.currentUser;
    //         if (user && userId) {
    //             const currentUserRef = doc(db, "users", user.uid);
    //             const currentUserDoc = await getDoc(currentUserRef);
    //             if (currentUserDoc.exists()) {
    //                 const currentUserData = currentUserDoc.data();
    //                 setIsFollowing(currentUserData.following?.includes(userId));
    //             }
    //         }
    //     };
    //     checkFollowingStatus();
    // }, [auth, userId]);
    //
    // const handleFocus = (tabName) => {
    //     setFocusedTab(tabName);
    // };
    //
    // const handleFollowToggle = async () => {
    //     const user = auth.currentUser;
    //     if (user) {
    //         const currentUserRef = doc(db, "users", user.uid);
    //         const otherUserRef = doc(db, "users", userId);
    //
    //         await updateDoc(currentUserRef, {
    //             following: isFollowing ? arrayRemove(userId) : arrayUnion(userId)
    //         });
    //
    //         await updateDoc(otherUserRef, {
    //             followers: isFollowing ? arrayRemove(user.uid) : arrayUnion(user.uid)
    //         });
    //
    //         setIsFollowing(!isFollowing);
    //     }
    // };
    //
    // const handleCreatePost = async () => {
    //     try {
    //         const postDocRef = await addDoc(collection(db, "posts"), {
    //             imageUrl: imageUrl,
    //             uid: auth.currentUser.uid
    //         });
    //
    //         const postId = postDocRef.id;
    //         console.log("新しいポストのID:", postId);
    //     } catch (error) {
    //         console.error("情報の取得に失敗しました", error);
    //     }
    // };
    //
    // return (
    //     <MainLayout>
    //         <div className={s.allContainer}>
    //             <div className={s.header}>
    //                 <img src={userData?.headerImage || 'defaultHeader.png'} className={s.headerImage} />
    //             </div>
    //             <div className={s.container}>
    //                 <img src={userData?.icon || 'defaultIcon.png'} className={s.profileImage} />
    //                 <div>
    //                     <h2 className={s.userName}>{userData?.name || 'ユーザ名未設定'}</h2>
    //                     <p className={s.userId}>{userId || 'User ID 未設定'}</p>
    //                     <div className={s.followContainer}>
    //                         <Link href={`/Profile/${userId}/Follow`} className={s.add}>
    //                             <span className={s.follow}><strong>{userData?.following?.length || 0}</strong> Following</span>
    //                         </Link>
    //                         <Link href={`/Profile/${userId}/Follow`} className={s.add}>
    //                             <span className={s.follower}><strong>{userData?.followers?.length || 0}</strong> Followers</span>
    //                         </Link>
    //                     </div>
    //                     <button className={s.followButton} onClick={handleFollowToggle}>
    //                         {isFollowing ? 'Unfollow' : 'Follow'}
    //                     </button>
    //                     <p className={s.bio}>{userData?.bio || '自己紹介未設定'}</p>
    //                 </div>
    //             </div>
    //             <Tabs>
    //                 <TabList className={s.tabsContainer}>
    //                     <Tab className={`${s.tabs} ${s.tabFirst} ${focusedTab === 'tabSecond' ? s.zIndex1 : ''} ${focusedTab === 'tabThird' ? s.zIndex1 : ''}`} onFocus={() => handleFocus('tabFirst')} tabIndex={0}>Posts</Tab>
    //                     <Tab className={`${s.tabs} ${s.tabSecond} ${focusedTab === 'tabSecond' ? s.zIndex2 : ''}`} onFocus={() => handleFocus('tabSecond')} tabIndex={0}>Media</Tab>
    //                     <Tab className={`${s.tabs} ${s.tabThird} ${focusedTab === 'tabThird' ? s.zIndex3 : ''}`} onFocus={() => handleFocus('tabThird')} tabIndex={0}>Likes</Tab>
    //                 </TabList>
    //                 <TabPanel>
    //                     <article>
    //                         <div className={s.postsContainer}>
    //                             {userPosts.map((post) => (
    //                                 <Link key={post.id} href={`/Profile/${post.uid}/Post/${post.id}`}>
    //                                     <img src={post.imageUrl} alt="Post Image" className={s.postImage} />
    //                                 </Link>
    //                             ))}
    //                         </div>
    //                     </article>
    //                 </TabPanel>
    //                 <TabPanel>
    //                     <article>
    //                         <p>media</p>
    //                     </article>
    //                 </TabPanel>
    //                 <TabPanel>
    //                     <article>
    //                         <p>third</p>
    //                     </article>
    //                 </TabPanel>
    //             </Tabs>
    //         </div>
    //     </MainLayout>
    // );
// };
//
// export default OtherUserProfile;