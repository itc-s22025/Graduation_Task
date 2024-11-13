'use client';
import MainLayout from "../../../components/MainLayout";
import UnfollowModal from "@/components/UnfollowModel";
import s from './follower.module.css';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AccountHeader from "@/components/AccountHeader";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthProvider";

const FollowPage = () => {
    const [focusedTab, setFocusedTab] = useState(0);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const db = getFirestore();
    const auth = useAuth();

    const handleFocus = (index) => setFocusedTab(index);

    // Fetch following users
    useEffect(() => {
        const fetchFollowingUsers = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);
                const followingIds = userDoc.data()?.following || [];

                const userPromises = followingIds.map(async (userId) => {
                    const userDocRef = doc(db, "users", userId);
                    const userSnapshot = await getDoc(userDocRef);
                    return userSnapshot.exists() ? { id: userId, ...userSnapshot.data() } : null;
                });

                const users = (await Promise.all(userPromises)).filter(Boolean);
                setFollowingUsers(users);
            }
        };
        fetchFollowingUsers();
    }, [auth.currentUser, db]);

    // Open modal and set selected user ID
    const handleUnfollowClick = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => setShowModal(false);

    // Confirm Unfollow action
    const confirmUnfollow = async () => {
        if (auth.currentUser && selectedUserId) {
            const userRef = doc(db, "users", auth.currentUser.uid);

            // Remove user from following list in Firestore
            await updateDoc(userRef, {
                following: followingUsers
                    .filter((user) => user.id !== selectedUserId)
                    .map((user) => user.id),
            });

            // Update local following users state
            setFollowingUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== selectedUserId)
            );
            closeModal();
        }
    };

    return (
        <MainLayout>
            <div className={s.allContainer}>
                <AccountHeader title="Follow" />
                <Tabs selectedIndex={focusedTab} onSelect={handleFocus} className={s.all}>
                    <TabList className={s.ul}>
                        <Tab
                            className={`${s.tabs} ${s.tabFirst} ${focusedTab === 0 ? s.tabSelected : ''}`}
                            onClick={() => handleFocus(0)}
                        >
                            Followers
                        </Tab>
                        <Tab
                            className={`${s.tabs} ${s.tabSecond} ${focusedTab === 1 ? s.tabSelected : ''}`}
                            onClick={() => handleFocus(1)}
                        >
                            Following
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <article className={s.row}>
                            <p>フォロワーは現在いません。</p>
                        </article>
                    </TabPanel>

                    <TabPanel>
                        <article className={s.info}>
                            {followingUsers.length > 0 ? (
                                followingUsers.map((user) => (
                                    <div key={user.id} className={s.userCard}>
                                        <img src={user.icon || 'defaultIcon.png'} alt="User Icon" className={s.userIcon} />
                                        <div className={s.userInfo}>
                                            <p className={s.userName}>{user.name || "No Name"}</p>
                                            <p className={s.userId}>@{user.id}</p>
                                            <p className={s.bio}>{user.bio || "No Bio"}</p>
                                            {/*<div className={s.following}>*/}
                                                <button
                                                    onClick={() => handleUnfollowClick(user.id)}
                                                    className={s.unfollowing}>Following
                                                </button>
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>フォローしているユーザーはいません。</p>
                            )}
                        </article>
                    </TabPanel>
                </Tabs>

                <UnfollowModal
                    isOpen={showModal}
                    onClose={closeModal}
                    onConfirm={confirmUnfollow}
                />
            </div>
        </MainLayout>
    );
};

export default FollowPage;
