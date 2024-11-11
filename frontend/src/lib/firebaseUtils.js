// src/lib/firebaseUtils.js
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export const fetchPostData = async () => {
    const postsCollection = collection(db, "posts");
    const postSnapshot = await getDocs(postsCollection);
    return postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
