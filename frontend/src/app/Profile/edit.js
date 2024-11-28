'use client';

import React, { useState, useEffect } from 'react';
import s from './edit.module.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from '@/app/context/AuthProvider';
import CropModal from "./components/CropModal";

const Edit = ({ onSave }) => {
    const [newHeaderImage, setNewHeaderImage] = useState(null);
    const [newIcon, setNewIcon] = useState(null);
    const [newName, setNewName] = useState('');
    const [newBio, setNewBio] = useState('');
    const [previewHeaderImage, setPreviewHeaderImage] = useState(null);
    const [previewIcon, setPreviewIcon] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [isForHeader, setIsForHeader] = useState(false);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);

    const { currentUser } = useAuth();
    const db = getFirestore();
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

    const openCropModal = (fileUrl, isHeader) => {
        setImageToCrop(fileUrl);
        setIsForHeader(isHeader);
        setIsCropModalOpen(true);
    };

    const handleCropComplete = async (croppedImage) => {
        if (!currentUser?.uid) return;

        try {
            const response = await fetch(croppedImage);
            const blob = await response.blob();
            const fileName = isForHeader
                ? `headers/${currentUser.uid}_header.jpg`
                : `icons/${currentUser.uid}_icon.jpg`;

            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);

            const userRef = doc(db, "users", currentUser.uid);
            if (isForHeader) {
                await updateDoc(userRef, { headerImage: downloadURL });
                setNewHeaderImage(downloadURL);
                setPreviewHeaderImage(downloadURL);
            } else {
                await updateDoc(userRef, { icon: downloadURL });
                setNewIcon(downloadURL);
                setPreviewIcon(downloadURL);
            }
        } catch (error) {
            console.error("Error saving cropped image:", error);
            alert("トリミング画像の保存中にエラーが発生しました。");
        }
    };

    const uploadImage = async (file, path) => {
        const storageRef = ref(storage, `images/${path}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    // Bioが20文字を超えた場合にエラーを表示し、保存を無効にする
    const handleSave = async () => {
        if (!currentUser?.uid) {
            alert("You must be signed in to edit your profile.");
            return;
        }

        // Bioの文字数チェック
        if (newBio.length > 20) {
            alert("Bioは20文字以内で入力してください。");
            return;
        }

        try {
            const userRef = doc(db, "users", currentUser.uid);
            const currentData = (await getDoc(userRef)).data();

            const updatedData = {
                ...currentData,
                headerImage: newHeaderImage instanceof File
                    ? await uploadImage(newHeaderImage, `headers/${currentUser.uid}_header.png`)
                    : previewHeaderImage,
                icon: newIcon instanceof File
                    ? await uploadImage(newIcon, `icons/${currentUser.uid}_icon.png`)
                    : previewIcon,
                username: newName,
                bio: newBio,
            };

            await updateDoc(userRef, updatedData);
            onSave?.(updatedData);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("プロフィールの更新中にエラーが発生しました。");
        }
    };

    // preventScroll関数の定義
    const preventScroll = (e) => {
        e.preventDefault();
    };

    const handleEditClick = () => {
        setShowEditModal(true);
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
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
                            const fileUrl = URL.createObjectURL(file);
                            openCropModal(fileUrl, true);
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
                            const fileUrl = URL.createObjectURL(file);
                            openCropModal(fileUrl, false);
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
            {isCropModalOpen && (
                <CropModal
                    isOpen={isCropModalOpen}
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onClose={() => setIsCropModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Edit;