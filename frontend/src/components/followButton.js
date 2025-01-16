'use client';
import React, { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";

const FollowButton = ({ targetUserId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isMutualFollow, setIsMutualFollow] = useState(false);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!currentUser) return;

            const currentUserRef = doc(db, "users", currentUser.uid);
            const currentUserDoc = await getDoc(currentUserRef);

            if (currentUserDoc.exists()) {
                const following = currentUserDoc.data().following || [];
                setIsFollowing(following.includes(targetUserId));

                const targetUserRef = doc(db, "users", targetUserId);
                const targetUserDoc = await getDoc(targetUserRef);

                if (targetUserDoc.exists()) {
                    const followers = targetUserDoc.data().followers || [];
                    setIsMutualFollow(followers.includes(currentUser.uid));
                }
            }
        };

        checkFollowStatus();
    }, [currentUser, targetUserId]);

    const handleFollow = async () => {
        if (!currentUser) return;

        const currentUserRef = doc(db, "users", currentUser.uid);
        const targetUserRef = doc(db, "users", targetUserId);

        try {
            if (isFollowing) {
                await updateDoc(currentUserRef, {
                    following: arrayRemove(targetUserId),
                });
                await updateDoc(targetUserRef, {
                    followers: arrayRemove(currentUser.uid),
                });
            } else {
                await updateDoc(currentUserRef, {
                    following: arrayUnion(targetUserId),
                });
                await updateDoc(targetUserRef, {
                    followers: arrayUnion(currentUser.uid),
                });
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Follow action failed:", error);
        }
    };

    return (
        <button onClick={handleFollow}>
            {isMutualFollow ? "Mutual Follow" : isFollowing ? "Following" : "Follow"}
        </button>
    );
};

export default FollowButton;