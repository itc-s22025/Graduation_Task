import React, { useState, useEffect } from 'react';
import s from './edit.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useAuth } from '@/app/context/AuthProvider';
import { useRouter } from "next/navigation";

const Edit = ({ userData, onSave }) => {
    const [newHeaderImage, setNewHeaderImage] = useState(userData?.headerImage || 'defaultHeader.png');
    const [newIcon, setNewIcon] = useState(userData?.icon || 'defaultIcon.png');
    const [newName, setNewName] = useState(userData?.username || 'ユーザー名');
    const [newBio, setNewBio] = useState(userData?.bio || 'ここにBioが表示されます');

    const { currentUser } = useAuth();
    const db = getFirestore();
    const router = useRouter();
    const storage = getStorage();

    const uploadImage = async (file, path) => {
        const storageRef = ref(storage, `images/${path}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSave = async () => {
        if (!currentUser?.uid) {
            console.error("User is not authenticated.");
            alert("You must be signed in to edit your profile.");
            return;
        }

        try {
            const updatedData = {
                headerImage: newHeaderImage instanceof File ? await uploadImage(newHeaderImage, `headers/${currentUser.uid}_header.png`) : newHeaderImage,
                icon: newIcon instanceof File ? await uploadImage(newIcon, `icons/${currentUser.uid}_icon.png`) : newIcon,
                username: newName,
                bio: newBio
            };

            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, updatedData);

            if (typeof onSave === 'function') onSave(updatedData);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile");
        }
    };

    return (
        <div className={s.container}>
            <h2 className={s.font}>Edit Profile</h2>
            <div className={s.field}>
                <label htmlFor="headerImage" className={s.label}>Header Image</label>
                <input
                    type="file"
                    accept="image/*"
                    id="headerImage"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setNewHeaderImage(e.target.files[0]);
                        }
                    }}
                />
                {typeof newHeaderImage === 'string' && <img src={newHeaderImage} alt="Header" className={s.newHeaderImage} />}
            </div>
            <div className={s.field}>
                <label htmlFor="avatar" className={s.label}>Icon</label>
                <input
                    type="file"
                    accept="image/*"
                    id="icon"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setNewIcon(e.target.files[0]);
                        }
                    }}
                />
                {typeof newIcon === 'string' && <img src={newIcon} alt="Icon" className={s.newAvatar} />}
            </div>
            <div className={s.field}>
                <label htmlFor="username" className={s.label}>Username</label>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>
            <div className={s.field}>
                <label htmlFor="bio" className={s.label}>Bio</label>
                <textarea
                    id="bio"
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className={s.bioInput}
                />
            </div>
            <button className={s.edit} onClick={handleSave}>Save</button>
        </div>
    );
};

export default Edit;