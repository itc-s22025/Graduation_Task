'use client';

import s from './update.module.css';
import MainLayout from "@/components/MainLayout";
import AccountHeader from "@/components/AccountHeader";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthProvider";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import UpdatePage from "@/app/Settings/Info/Pass/UpDateInfo/update";

const UpdateInfo = () => {
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const auth = useAuth();
    const db = getFirestore();
    const [showEditModel, setShowEditModel] = useState(false);
    const [displayId, setDisplayId] = useState("");

    const preventScroll = (e) => e.preventDefault();

    const handleEditClick = () => {
        setShowEditModel(true);
        window.addEventListener('wheel', preventScroll, { passive: true });
        window.addEventListener('touchmove', preventScroll, { passive: false });
    };

    const handleCloseEditModal = () => {
        setShowEditModel(false);
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
    };

    const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                setName(data.name || 'User');
                setUserId(data.id || 'User ID');
                setEmail(data.email || 'Email');
                setDisplayId(data.displayId || 'User ID');
            }
        }
    };

    const handleSave = async (updatedData) => {
        await fetchUserData(); // Re-fetch user data from Firebase
        handleCloseEditModal(); // Close modal after saving
    };

    useEffect(() => {
        fetchUserData();
    }, [auth, db]);

    return (
        <MainLayout>
            <div className={s.allContainer}>
                <AccountHeader title="Account Update" />
                <div className={s.all}>
                    <h2 className={s.font1}>UserName</h2>
                    <h3 className={s.box}>{name}</h3>

                    <h2 className={s.font2}>UserID</h2>
                    <h3 className={s.box2}>{displayId}</h3>

                    <h2 className={s.font3}>Email-Address</h2>
                    <h3 className={s.box3}>{email}</h3>

                    <button className={s.edit} onClick={handleEditClick}>Edit</button>

                    {showEditModel && (
                        <div className={s.modalOverlay}>
                            <div className={s.modalContent}>
                                <UpdatePage onSave={handleSave} />
                                <button onClick={handleCloseEditModal} className={s.closeButton}>Close</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default UpdateInfo;