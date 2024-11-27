'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropUtils'; // 既存のgetCroppedImg関数を利用

const CropModal = ({ isOpen, image, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        if (!croppedAreaPixels || !image) return;

        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels); // トリミング後の画像を取得
            onCropComplete(croppedImage); // 親コンポーネントにトリミング画像を渡す
            onClose(); // モーダルを閉じる
        } catch (error) {
            console.error('Error cropping the image:', error);
        }
    };

    if (!isOpen) return null; // モーダルが開いていないときは何も表示しない

    return (
        <div style={modalStyle}>
            <div style={cropperContainerStyle}>
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3} // アスペクト比を調整（ヘッダー画像用）
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropCompleteHandler}
                />
            </div>
            <div >
                <button style={buttonContainerStyle} onClick={onClose}>Cancel</button>
                <button style={buttonContainerStyles} onClick={handleCropSave}>Save</button>
            </div>
        </div>
    );
};

export default CropModal;

// スタイル
const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const cropperContainerStyle = {
    width: '400px',
    height: '300px',
    backgroundColor: '#fff',
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
};

const buttonContainerStyle = {
    position: 'absolute',
    top: '67vh',
    left: '40vw',
    display: 'flex',
    borderRadius: '8px',
    height: '40px',
    width: '100px',
    fontSize: '1.3rem',
    padding: '10px 10px 10px 14px',
    color: 'white',
    backgroundColor: '#FF92AD',
    borderColor: '#ff839f',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '5px',
    gap: '10px',
};

const buttonContainerStyles = {
    position: 'absolute',
    top: '67vh',
    left: '55vw',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    height: '40px',
    width: '100px',
    fontSize: '1.3rem',
    padding: '10px 10px 10px 22px',
    color: 'white',
    borderColor: '#ff839f',
    backgroundColor: '#FF92AD',
    justifyContent: 'space-between',
    marginTop: '5px',
    gap: '10px',
};
