'use client';

import React, { useState } from 'react';
import s from './upEdit.module.css';

const UpdatePage = ({ currentData, onSave }) => {
    const [name, setName] = useState(currentData.name);
    const [email, setEmail] = useState(currentData.email);
    const [displayId, setDisplayId] = useState(currentData.displayId);

    const handleSaveClick = () => {
        const updatedData = {};
        if (name !== currentData.name) updatedData.name = name;
        if (email !== currentData.email) updatedData.email = email;
        if (displayId !== currentData.displayId) updatedData.displayId = displayId;

        onSave(updatedData);
    };

    return (
        <div className={s.container}>
            <h2 className={s.font}> Edit Information</h2>
            <div className={s.field}>
                <label className={s.label}>UserName</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={s.box}
                />
            </div>
            <div className={s.field}>
                <label className={s.label}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={s.box}
                />
            </div>
            <div className={s.field}>
                <label className={s.label}>UserID</label>
                <input
                    type="text"
                    value={displayId}
                    onChange={(e) => setDisplayId(e.target.value)}
                    className={s.box}
                />
            </div>
            <button onClick={handleSaveClick} className={s.saveButton}>Save</button>
        </div>
    );
};

export default UpdatePage;

// 'use client';
//
// import s from './upEdit.module.css';
// import { useState } from "react";
// import { useAuth } from "@/app/context/AuthProvider";
// import { doc, getDoc, getFirestore, updateDoc, setDoc } from "firebase/firestore";
//
// const UpdatePage = ({ onSave }) => {
//     const [newName, setNewName] = useState('');
//     const [newDisplayId, setNewDisplayId] = useState('');
//     const [newEmail, setNewEmail] = useState('');
//     const auth = useAuth();
//     const db = getFirestore();
//
//
//     const handleSave = async () => {
//         try {
//             const user = auth.currentUser;
//             if (!user) {
//                 alert('User not logged in');
//                 return;
//             }
//
//             const userDocRef = doc(db, "users", user.uid);
//
//             // Save data to Firebase
//             await updateDoc(userDocRef, {
//                 name: newName,
//                 displayId: newDisplayId,
//                 email: newEmail
//             });
//
//             alert('Account information updated successfully.');
//
//             // Call the onSave callback with updated data
//             if (typeof onSave === 'function') {
//                 onSave({ name: newName, displayId: newDisplayId, email: newEmail });
//             }
//         } catch (error) {
//             console.error("Error updating information:", error);
//             alert("Error updating account information.");
//         }
//     };
//
//     return (
//         <div className={s.container}>
//             <h2 className={s.font}>Update Profile</h2>
//             <div className={s.field}>
//                 <label htmlFor="name" className={s.label}>UserName</label>
//                 <input
//                     type="text"
//                     value={newName}
//                     className={s.box}
//                     onChange={(e) => setNewName(e.target.value)}
//                 />
//             </div>
//
//             <div className={s.field}>
//                 <label htmlFor="displayId" className={s.label}>UserId</label>
//                 <input
//                     type="text"
//                     value={newDisplayId}
//                     className={s.box}
//                     onChange={(e) => setNewDisplayId(e.target.value)}
//                 />
//             </div>
//
//             <div className={s.field}>
//                 <label htmlFor="email" className={s.label}>UserEmail</label>
//                 <input
//                     type="email"
//                     value={newEmail}
//                     className={s.box}
//                     onChange={(e) => setNewEmail(e.target.value)}
//                 />
//             </div>
//
//             <button className={s.saveButton} onClick={handleSave}>Save</button>
//         </div>
//     );
// };
//
// export default UpdatePage;
