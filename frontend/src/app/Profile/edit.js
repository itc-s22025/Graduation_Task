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
                    setPreviewHeaderImage(data.headerImage || 'defaultHeader.png');
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

    const handleCropComplete = (croppedImage) => {
        if (isForHeader) {
            setNewHeaderImage(croppedImage);
            setPreviewHeaderImage(croppedImage);
        } else {
            setNewIcon(croppedImage);
            setPreviewIcon(croppedImage);
        }
        setIsCropModalOpen(false);
    };

    const uploadImage = async (file, path) => {
        const storageRef = ref(storage, `images/${path}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSave = async () => {
        if (!currentUser?.uid) {
            alert("You must be signed in to edit your profile.");
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


// 'use client';
//
// import React, { useState, useEffect } from 'react';
// import s from './edit.module.css';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
// import { useAuth } from '@/app/context/AuthProvider';
// import { useRouter } from "next/navigation";
// import CropModal from "./components/CropModal";
//
// const Edit = ({ onSave }) => {
//     const [newHeaderImage, setNewHeaderImage] = useState(null);
//     const [newIcon, setNewIcon] = useState(null);
//     const [newName, setNewName] = useState('');
//     const [newBio, setNewBio] = useState('');
//     const [previewHeaderImage, setPreviewHeaderImage] = useState(null);
//     const [previewIcon, setPreviewIcon] = useState(null);
//     const [imageToCrop, setImageToCrop] = useState(null);
//     const [isForHeader, setIsForHeader] = useState(false);
//     const [isCropModalOpen, setIsCropModalOpen] = useState(false);
//     const [showCropModal, setShowCropModal] = useState(false);
//     const handleCloseCropModal = () => {
//         setShowCropModal(false);
//     }
//
//     const { currentUser } = useAuth();
//     const db = getFirestore();
//     const router = useRouter();
//     const storage = getStorage();
//
//     const openCropModal = (imageSrc, isHeader) => {
//         setImageToCrop(imageSrc);
//         setIsForHeader(isHeader);
//         setIsCropModalOpen(true);
//     }
//
//     const handleCropComplete = (croppedImage) => {
//         if (isForHeader) {
//             setNewHeaderImage(croppedImage);
//             setPreviewHeaderImage(croppedImage);
//         } else {
//             setNewIcon(croppedImage);
//             setPreviewIcon(croppedImage);
//         }
//     }
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (!currentUser?.uid) return;
//
//             try {
//                 const userRef = doc(db, "users", currentUser.uid);
//                 const userSnapshot = await getDoc(userRef);
//
//                 if (userSnapshot.exists()) {
//                     const data = userSnapshot.data();
//                     setNewHeaderImage(data.headerImage || 'defaultHeader.png');
//                     setPreviewHeaderImage(data.headerImage || 'defaultHeader.png');
//                     setNewIcon(data.icon || 'defaultIcon.png');
//                     setPreviewIcon(data.icon || 'defaultIcon.png');
//                     setNewName(data.username || 'ユーザー名');
//                     setNewBio(data.bio || 'ここにBioが表示されます');
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         };
//
//         fetchUserData();
//     }, [currentUser, db]);
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
//             const userRef = doc(db, "users", currentUser.uid);
//             const userSnapshot = await getDoc(userRef);
//             const currentData = userSnapshot.exists() ? userSnapshot.data() : {};
//
//             const updatedData = {
//                 ...currentData,
//                 headerImage: newHeaderImage instanceof File
//                     ? await uploadImage(newHeaderImage, `headers/${currentUser.uid}_header.png`)
//                     : currentData.headerImage,
//                 icon: newIcon instanceof File
//                     ? await uploadImage(newIcon, `icons/${currentUser.uid}_icon.png`)
//                     : currentData.icon,
//                 username: newName || currentData.username,
//                 bio: newBio || currentData.bio,
//             };
//
//             await updateDoc(userRef, updatedData);
//
//             if (typeof onSave === 'function') {
//                 onSave(updatedData);
//             } else {
//                 console.log("Updated data:", updatedData);
//             }
//         } catch (error) {
//             console.error("Error updating profile:", error);
//             alert("プロフィールの更新中にエラーが発生しました。もう一度お試しください。");
//         }
//     };
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
//                             const file = e.target.files[0];
//                             const fileUrl = URL.createObjectURL(file)
//                             openCropModal(fileUrl, true);
//                             // setNewHeaderImage(file);
//                             // setPreviewHeaderImage(URL.createObjectURL(file));
//                         }
//                     }}
//                 />
//                 {previewHeaderImage && <img src={previewHeaderImage} className={s.newHeaderImage} />}
//             </div>
//             <div className={s.field}>
//                 <label htmlFor="icon" className={s.label}>Profile Icon</label>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     id="icon"
//                     onChange={(e) => {
//                         if (e.target.files && e.target.files[0]) {
//                             const file = e.target.files[0];
//                             const fileUrl = URL.createObjectURL(file);
//                             openCropModal(fileUrl, true);
//                             // setNewIcon(file);
//                             // setPreviewIcon(URL.createObjectURL(file));
//                         }
//                     }}
//                 />
//                 {previewIcon && <img src={previewIcon} className={s.newAvatar} />}
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
//             {isCropModalOpen && (
//                 <CropModal
//                     isOpen={isCropModalOpen}
//                     image={previewHeaderImage} // プレビュー画像が渡されているか確認
//                     onCropComplete={handleCropComplete}
//                     onClose={handleCloseCropModal}
//                 />
//
//             )}
//         </div>
//     );
// };
//
// export default Edit;