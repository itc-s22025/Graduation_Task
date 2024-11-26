'use client';

import React, { useState, useEffect } from 'react';
import s from './edit.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from '@/app/context/AuthProvider';
import { useRouter } from "next/navigation";

const Edit = ({ onSave }) => {
    const [newHeaderImage, setNewHeaderImage] = useState(null);
    const [newIcon, setNewIcon] = useState(null);
    const [newName, setNewName] = useState('');
    const [newBio, setNewBio] = useState('');
    const [previewHeaderImage, setPreviewHeaderImage] = useState(null);
    const [previewIcon, setPreviewIcon] = useState(null);

    const { currentUser } = useAuth();
    const db = getFirestore();
    const router = useRouter();
    const storage = getStorage();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser?.uid) return;

            try {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    const data = userSnapshot.data();
                    setNewHeaderImage(data.headerImage || 'defaultHeader.png');
                    setPreviewHeaderImage(data.headerImage || 'defaultHeader.png');
                    setNewIcon(data.icon || 'defaultIcon.png');
                    setPreviewIcon(data.icon || 'defaultIcon.png');
                    setNewName(data.username || 'ユーザー名');
                    setNewBio(data.bio || 'ここにBioが表示されます');
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [currentUser, db]);

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
            const userRef = doc(db, "users", currentUser.uid);
            const userSnapshot = await getDoc(userRef);
            const currentData = userSnapshot.exists() ? userSnapshot.data() : {};

            const updatedData = {
                ...currentData,
                headerImage: newHeaderImage instanceof File
                    ? await uploadImage(newHeaderImage, `headers/${currentUser.uid}_header.png`)
                    : currentData.headerImage,
                icon: newIcon instanceof File
                    ? await uploadImage(newIcon, `icons/${currentUser.uid}_icon.png`)
                    : currentData.icon,
                username: newName || currentData.username,
                bio: newBio || currentData.bio,
            };

            await updateDoc(userRef, updatedData);

            if (typeof onSave === 'function') {
                onSave(updatedData);
            } else {
                console.log("Updated data:", updatedData);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("プロフィールの更新中にエラーが発生しました。もう一度お試しください。");
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
                            const file = e.target.files[0];
                            setNewHeaderImage(file);
                            setPreviewHeaderImage(URL.createObjectURL(file));
                        }
                    }}
                />
                {previewHeaderImage && <img src={previewHeaderImage} className={s.newHeaderImage} />}
            </div>
            <div className={s.field}>
                <label htmlFor="icon" className={s.label}>Profile Icon</label>
                <input
                    type="file"
                    accept="image/*"
                    id="icon"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setNewIcon(file);
                            setPreviewIcon(URL.createObjectURL(file));
                        }
                    }}
                />
                {previewIcon && <img src={previewIcon} className={s.newAvatar} />}
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


// import React, { useState, useEffect } from 'react';
// import s from './edit.module.css';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
// import { useAuth } from '@/app/context/AuthProvider';
// import { useRouter } from "next/navigation";
//
// const Edit = ({ userData, onSave }) => {
//     const [newHeaderImage, setNewHeaderImage] = useState(userData?.headerImage || 'defaultHeader.png');
//     const [newIcon, setNewIcon] = useState(userData?.icon || 'defaultIcon.png');
//     const [newName, setNewName] = useState(userData?.username || 'ユーザー名');
//     const [newBio, setNewBio] = useState(userData?.bio || 'ここにBioが表示されます');
//
//     const { currentUser } = useAuth();
//     const db = getFirestore();
//     const router = useRouter();
//     const storage = getStorage();
//
//     const uploadImage = async (file, path) => {
//         const storageRef = ref(storage, `images/${path}`);
//         await uploadBytes(storageRef, file);
//         return await getDownloadURL(storageRef);
//     };
//
//     const handleSave = async () => {
//         if (!currentUser?.uid) {
//             console.error("User is not authenticated.");
//             alert("You must be signed in to edit your profile.");
//             return;
//         }
//
//         try {
//             // Firestoreから現在のデータを取得
//             const userRef = doc(db, "users", currentUser.uid);
//             const userSnapshot = await getDoc(userRef); // 修正: getDoc を使用
//
//             const currentData = userSnapshot.exists() ? userSnapshot.data() : {};
//
//             // 新しいデータを準備
//             const updatedData = {
//                 ...currentData, // 現在のデータを展開
//                 headerImage: newHeaderImage instanceof File
//                     ? await uploadImage(newHeaderImage, `headers/${currentUser.uid}_header.png`)
//                     : newHeaderImage || currentData.headerImage, // ヘッダー画像
//                 icon: newIcon instanceof File
//                     ? await uploadImage(newIcon, `icons/${currentUser.uid}_icon.png`)
//                     : newIcon || currentData.icon, // アイコン
//                 username: newName || currentData.username, // ユーザー名
//                 bio: newBio || currentData.bio, // Bio
//             };
//
//             // データをFirestoreに保存
//             await updateDoc(userRef, updatedData);
//
//             if (typeof onSave === 'function') onSave(updatedData);
//         } catch (error) {
//             console.error("Error updating profile:", error);
//             alert("Error updating profile");
//         }
//     };
//
//
//
//     // const handleSave = async () => {
//     //     if (!currentUser?.uid) {
//     //         console.error("User is not authenticated.");
//     //         alert("You must be signed in to edit your profile.");
//     //         return;
//     //     }
//     //
//     //     try {
//     //         const updatedData = {
//     //             headerImage: newHeaderImage instanceof File ? await uploadImage(newHeaderImage, `headers/${currentUser.uid}_header.png`) : newHeaderImage,
//     //             icon: newIcon instanceof File ? await uploadImage(newIcon, `icons/${currentUser.uid}_icon.png`) : newIcon,
//     //             username: newName,
//     //             bio: newBio
//     //         };
//     //
//     //         const userRef = doc(db, "users", currentUser.uid);
//     //         await updateDoc(userRef, updatedData);
//     //
//     //         if (typeof onSave === 'function') onSave(updatedData);
//     //     } catch (error) {
//     //         console.error("Error updating profile:", error);
//     //         alert("Error updating profile");
//     //     }
//     // };
//
//     return (
//         <div className={s.container}>
//             <h2 className={s.font}>Edit Profile</h2>
//             <div className={s.field}>
//                 <label htmlFor="headerImage" className={s.label}>Header Image</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     id="headerImage"
//                     onChange={(e) => {
//                         if (e.target.files && e.target.files[0]) {
//                             setNewHeaderImage(e.target.files[0]);
//                         }
//                     }}
//                 />
//                 {typeof newHeaderImage === 'string' && <img src={newHeaderImage} className={s.newHeaderImage} />}
//             </div>
//             <div className={s.field}>
//                 <label htmlFor="avatar" className={s.label}>Icon</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     id="icon"
//                     onChange={(e) => {
//                         if (e.target.files && e.target.files[0]) {
//                             setNewIcon(e.target.files[0]);
//                         }
//                     }}
//                 />
//                 {typeof newIcon === 'string' && <img src={newIcon}  className={s.newAvatar} />}
//             </div>
//             <div className={s.field}>
//                 <label htmlFor="username" className={s.label}>Username</label>
//                 <input
//                     type="text"
//                     value={newName}
//                     onChange={(e) => setNewName(e.target.value)}
//                 />
//             </div>
//             <div className={s.field}>
//                 <label htmlFor="bio" className={s.label}>Bio</label>
//                 <textarea
//                     id="bio"
//                     value={newBio}
//                     onChange={(e) => setNewBio(e.target.value)}
//                     className={s.bioInput}
//                 />
//             </div>
//             <button className={s.edit} onClick={handleSave}>Save</button>
//         </div>
//     );
// };
//
// export default Edit;