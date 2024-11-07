// pages/AnotherScreen/[postId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const AnotherScreen = () => {
    const router = useRouter();
    const { postId } = router.query;
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        const fetchPostData = async () => {
            if (postId) {
                const postRef = doc(db, 'posts', postId);
                const postSnap = await getDoc(postRef);
                if (postSnap.exists()) {
                    setPostData(postSnap.data());
                } else {
                    console.log("No such document!");
                }
            }
        };
        fetchPostData();
    }, [postId]);

    if (!postData) return <p>Loading...</p>;

    return (
        <div>
            <h1>{postData.name} Post</h1>
            {postData.imageUrl && (
                <img src={postData.imageUrl} alt="Post image" style={{ width: '100%' }} />
            )}
            <p>{postData.tweet}</p>
        </div>
    );
};

export default AnotherScreen;
