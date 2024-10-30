import React, { useState } from 'react';
import s from './edit.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useAuth } from '@/app/context/AuthProvider';


const Edit = ({ userData, onSave }) => {
    const [newHeaderImage, setNewHeaderImage] = useState(userData?.headerImage || 'defaultHeader.png');
    const [newIcon, setNewIcon] = useState(userData?.icon || 'defaultIcon.png');
    const [newName, setNewName] = useState(userData?.username || 'ユーザー名');
    const [newBio, setNewBio] = useState(userData?.bio || 'ここにBioが表示されます');

    const auth = useAuth();
    const db = getFirestore();
    const storage = getStorage();

    // デバッグ用ログ
    console.log('Auth object:', auth);
    console.log('User Data:', userData);

    const uploadImage = async (file, path) => {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSave = async () => {
        console.log('Save button clicked');
        try {
            const user = auth.currentUser;
            if (!user) {
                alert('User not logged in');
                return;
            }

            console.log('User:', user);

            const headerImageUrl = newHeaderImage instanceof File
                ? await uploadImage(newHeaderImage, `users/${user.uid}/headerImage`)
                : newHeaderImage;

            const iconImageUrl = newIcon instanceof File
                ? await uploadImage(newIcon, `users/${user.uid}/icon`)
                : newIcon;

            console.log('Header Image URL:', headerImageUrl);
            console.log('Icon Image URL:', iconImageUrl);

            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                headerImage: headerImageUrl,
                icon: iconImageUrl,
                name: newName,
                bio: newBio
            });

            alert('Profile updated successfully');

            if (typeof onSave === 'function') {
                onSave({ headerImage: headerImageUrl, icon: iconImageUrl, username: newName, bio: newBio });
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile");
        }
    };


    return (
        <div className={s.container}>
            <h2 className={s.font}>Edit Profile</h2>
            <div className={s.field}>
                <label htmlFor="headerImage" className={s.label}>HeaderTab Image</label>
                <input
                    type="file"
                    accept="image/*"
                    id="headerImage"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setNewHeaderImage(e.target.files[0]);  // Fileオブジェクトを保存
                        }
                    }}
                />
                {typeof newHeaderImage === 'string' && <img src={newHeaderImage} alt="New HeaderTab" className={s.newHeaderImage} />}
            </div>
            <div className={s.field}>

                <label htmlFor="avatar" className={s.label}>Icon</label>
                <input
                    type="file"
                    accept="image/*"
                    id="avatar"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setNewIcon(e.target.files[0]);  // Fileオブジェクトを保存
                        }
                    }}
                />
                {typeof newIcon === 'string' && <img src={newIcon} alt="New Avatar" className={s.newAvatar} />}
            </div>
            <div className={s.field}>
                <label htmlFor="name" className={s.label}>Username</label>
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
            <button className={s.editbutton} onClick={handleSave}>Save</button>
        </div>
    );
};

export default Edit;