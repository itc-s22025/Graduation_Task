'use client';

import s from './upEdit.module.css';
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthProvider";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

const UpdatePage = ({ onSave }) => {
    const [newName, setNewName] = useState('');
    const [newId, setNewId] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const auth = useAuth();
    const db = getFirestore();

    const handleSave = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert('User not logged in');
                return;
            }

            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                name: newName,
                id: newId,
                email: newEmail
            });

            alert('Account information updated successfully.');

            // Call the onSave callback to pass updated values back to UpdateInfo
            if (typeof onSave === 'function') {
                onSave({ name: newName, id: newId, email: newEmail });
            }
        } catch (error) {
            console.error("Error updating information:", error);
            alert("Error updating account information.");
        }
    };

    return (
        <div className={s.container}>
            <h2 className={s.font}>Update Profile</h2>
            <div className={s.field}>
                <label htmlFor="name" className={s.label}>UserName</label>
                <input
                    type="text"
                    value={newName}
                    className={s.box}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>

            <div className={s.field}>
                <label htmlFor="Id" className={s.label}>UserId</label>
                <input
                    type="text"
                    value={newId}
                    className={s.box}
                    onChange={(e) => setNewId(e.target.value)}
                />
            </div>

            <div className={s.field}>
                <label htmlFor="email" className={s.label}>UserEmail</label>
                <input
                    type="email"
                    value={newEmail}
                    className={s.box}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
            </div>

            <button className={s.saveButton} onClick={handleSave}>Save</button>
        </div>
    );
};

export default UpdatePage;
