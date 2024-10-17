"use client";

import s from '@/styles/addTab.module.css';
import { useState } from 'react';

const AddTab = ({ pageType }) => {

    const [newTabName, setNewTabName] = useState('');
    const [showUsers, setShowUsers] = useState({
        all: false,
        following: false,
        bluebase: false,
        yellowbase: false,
        likeUsers: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setShowUsers(prev => ({ ...prev, [name]: checked }));
        } else {
            setShowUsers(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // フォーム送信時の処理をここに追加
        alert(`New Tab Name: ${newTabName}`);
        console.log('Show posts from:', showUsers);
    };

    return (
        <div className={`${s.container}`}>
            <h1 className={s.h1}>Add a new tab</h1>
            <form onSubmit={handleSubmit}>
                <div className={s.tabName}>
                    <label className={s.title} htmlFor="newTabName">New tab name: </label>
                    <input
                        type="text"
                        id="newTabName"
                        onChange={(e) => setNewTabName(e.target.value)}
                        value={newTabName}
                        placeholder="enter tab name"
                        className={s.inputName}
                        required
                    />
                </div>
                <div className={s.showPostsFromContainer}>
                    <p className={s.title}>Show posts from: </p>

                    <div className={s.checkboxes}>
                        <div>
                            <input
                                type="checkbox"
                                id="all"
                                name="all"
                                className={s.checkbox}
                                checked={showUsers.all}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="all" className={s.checkboxLabel}>all users</label>
                        </div>

                        <div>
                            <input
                                type="checkbox"
                                id="following"
                                name="following"
                                className={s.checkbox}
                                checked={showUsers.following}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="following" className={s.checkboxLabel}>following users</label>
                        </div>

                        <div>
                            <input
                                type="checkbox"
                                id="bluebase"
                                name="bluebase"
                                className={s.checkbox}
                                checked={showUsers.bluebase}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="bluebase" className={s.checkboxLabel}>blue-base users</label>
                        </div>

                        <div>
                            <input
                                type="checkbox"
                                id="yellowbase"
                                name="yellowbase"
                                className={s.checkbox}
                                checked={showUsers.yellowbase}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="yellowbase" className={s.checkboxLabel}>yellow-base users</label>
                        </div>

                        <div>
                            <input
                                type="checkbox"
                                id="likeUsers"
                                name="likeUsers"
                                className={s.checkbox}
                                onChange={(e) => setShowUsers(prev => ({ ...prev, likeUsers: e.target.checked ? '' : prev.likeUsers }))}
                            />
                            <label htmlFor="likeUsers" className={s.checkboxLabel}>users who like:</label>
                            {showUsers.likeUsers !== false && (
                                <input
                                    type="text"
                                    id="likeUsersText"
                                    name="likeUsersText"
                                    placeholder="(例)〇〇くん"
                                    className={s.checkboxInput}
                                    value={showUsers.likeUsers}
                                    onChange={(e) => setShowUsers(prev => ({ ...prev, likeUsers: e.target.value }))}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <input
                    type="submit"
                    value="Save"
                    className={s.save}
                />
            </form>
        </div>
    );
};

export default AddTab;
