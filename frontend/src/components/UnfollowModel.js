// components/UnfollowModal.js
'use client';
import s from '../styles/UnfollowModel.module.css';

const UnfollowModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className={s.modalOverlay}>
            <div className={s.modalContent}>
                <h3>ユーザーのフォローを解除しますか?</h3>
                <div className={s.buttons}>
                    <button onClick={onConfirm} className={s.unfollowButton}>はい</button>
                    <button onClick={onClose} className={s.cancelButton}>キャンセル</button>
                </div>
            </div>
        </div>
    );
};

export default UnfollowModal;
