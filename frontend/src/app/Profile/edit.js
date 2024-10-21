import React, { useState } from 'react';
import s from './edit.module.css';
import Image from "next/image";

const Edit = ({ userData, onSave }) => {
    // const [newIcon, setNewIcon] = useState(userData?.icon);
    // const [newName, setNewName] = useState(userData?.username);
    // const [newBio, setNewBio] = useState(userData?.bio);

    const [newHeaderImage, setNewHeaderImage] = useState(userData?.headerImage || 'defaultHeader.png');
    const [newIcon, setNewIcon] = useState(userData?.icon || 'defaultIcon.png');
    const [newName, setNewName] = useState(userData?.username || 'ユーザー名');
    const [newBio, setNewBio] = useState(userData?.bio || 'ここにBioが表示されます');

    const handleSave = () => {
        if (typeof onSave === 'function') {
            onSave({ headerImage: newHeaderImage, icon: newIcon, username: newName, bio: newBio });
        } else {
            console.log("onSave is not a function or missing");
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
                    onChange={(e) => setNewHeaderImage(URL.createObjectURL(e.target.files[0]))}
                />
                {newHeaderImage && <img src={newHeaderImage} alt="New HeaderTab" className={s.newHeaderImage} />}
            </div>
            <div className={s.field}>
                <label
                    htmlFor="avatar" className={s.label}>Icon</label>
                <input
                    type="file"
                    accept="image/*"
                    id="avatar"
                    onChange={(e) => setNewIcon(URL.createObjectURL(e.target.files[0]))}
                />
                {newIcon && <img src={newIcon} alt="New Avatar" className={s.newAvatar} />}
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
