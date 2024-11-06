'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import s from '@/styles/post.module.css';
import EachPost from "@/components/eachPost";
//firebase
import { auth, db } from "@/firebase";
import { collection, onSnapshot, addDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Post = ({ userId, searchTerm }) => {
    const pathname = usePathname()

    const [posts, setPosts] = useState([]);
    const [showEachPost, setShowEachPost] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [currentUserUid, setCurrentUserUid] = useState(null);

    //一度だけ実行されるやつ
    useEffect(() => {
        //onAuthStateChangedによりユーザーの認証状態を監視
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // userが存在する(ログインしている)場合はuidを、存在しない(ログインしていない)場合はnullをcurrentUserUidにセットする
            setCurrentUserUid(user ? user.uid : null);
        });
        //コンポーネントがアンマウントされるとき、unsubscribeを呼び出して監視を解除
        return () => unsubscribe();
    }, []);


    //currentUserUidかpathnameが変わるたびに実行されるやつ
    useEffect(() => {
        //onSnapshot -> postsコレクションのデータをリアルタイムで監視、コレクションが更新されるたびに(snapshot)を受け取って最新のデータが反映される
        const unsubscribe = onSnapshot(collection(db, "posts"), async (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({   //snapshot.docs...postsコレクション内のすべてのドキュメントをpostsData配列として返す
                id: doc.id,     //ドキュメントのid(doc.id)をidとする
                ...doc.data(),  //ドキュメントのデータ(doc.id)のシャローコピーを作成
                likedBy: [],    //likedByプロパティ(配列)を追加、いいねしたユーザの情報を保持するプロパティ
            }));

            // ここでpostsDataの内容を確認
            console.log("Fetched posts data:", postsData);
            // likes コレクションから各投稿に対するいいね情報を取得
            const likesSnapshot = await getDocs(collection(db, "likes"));
            const likesData = likesSnapshot.docs.map(doc => doc.data());

            // 各ポストに likedBy 情報を追加
            postsData.forEach(post => {
                post.likedBy = likesData
                    .filter(like => like.postId === post.id)
                    .map(like => like.userId);
            });

            // 現在のパスが /Profile のときのみフィルタリング(currentUserのポストのみ表示する)
            let filteredPosts = postsData;
            if (pathname === '/Profile') {  //もしpathnameが/Profileだったら
                filteredPosts = postsData.filter(post => post.uid === currentUserUid);  //filteredPostsにフィルタリングしたデータ(post.uidがcurrentUserUidと一致するポスト)を入れる
            }
            // フィルタリングされたデータをセット(されてない場合はpostsDataのまま)
            setPosts(filteredPosts);
        });

        //リアルタイム更新の監視を解除　終わりだよ〜
        return () => unsubscribe();
    }, [currentUserUid, pathname]);


    //いいね機能
    const handleLikeClick = async (postId) => {
       const postIndex = posts.findIndex(post => post.id === postId);   //post.id === postIDのインデックスを取得
       const post = posts[postIndex];   //投稿群の[postIndex]番目の投稿
       const alreadyLiked = post.likedBy.includes(currentUserUid);

       try {
           if (alreadyLiked) {  //すでにいいねしているとき
               const likesQuery = query(collection(db, "likes"), where("postId", "==", postId), where("userId", "==", currentUserUid));
               const querySnapshot = await getDocs(likesQuery); //postId(DB) == postId, userId(DB) == currentUserUidのドキュメントを取得
               querySnapshot.forEach((doc) => {
                   //ドキュメント自体を削除
                   deleteDoc(doc.ref);
               })

               //likedBy配列からcurrentUserUidを除外した新しい配列をつくり、その結果をpostsに反映させる
               setPosts(prevPosts => {
                   const updatedPosts = [...prevPosts]; //prevPostsのシャローコピーをupdatePostsとして保存
                   //[postIndex]番のlikedBy配列を更新...likedBy配列からcurrentUserIdと一致する要素を排除＝現在のユーザのUIDを削除
                   updatedPosts[postIndex].likedBy = updatedPosts[postIndex].likedBy.filter(uid => uid !== currentUserUid);
                   //更新されたupdatePostsを返し、それがsetPostsされてpostsステートになる
                   return updatedPosts;
               });

           } else { //まだいいねしていないとき
               if (!post.likedBy.includes(currentUserUid)) {   //もしcurrentUserがいいねしてなければ
                   await addDoc(collection(db, "likes"), {  //ドキュメントにpostId, userId, timestampを登録
                       postId: postId,
                       userId: currentUserUid,
                       timestamp: new Date(),
                   });

                   setPosts(prevPosts => {  //更新前のpostsの値の配列に変更を加える
                       const updatedPosts = [...prevPosts]; //prevPostsのシャローコピーをupdatePostsとして保存
                       if (!updatedPosts[postIndex].likedBy.includes(currentUserUid)) { //もし[postIndex]番のupdatePostsのlikedBy配列にcurrentUserUidが存在しなければ
                           updatedPosts[postIndex].likedBy.push(currentUserUid);    //currentUserUidを追加
                       }
                       //更新されたupdatePostsを返し、それがsetPostsされる
                       return updatedPosts;
                   });
               }
           }
       } catch (error) {
           console.error("いいね中のエラー: ", error);
       }
   };

    // 表示関連
    // showEachPost
    const [selectedPost, setSelectedPost] = useState(null);
    const handleEachPostClick = (post) => {
        setSelectedPost(post);  // クリックした投稿のデータをセット
        setShowEachPost(true);  // <EachPost />を表示
    };
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const handleReportButtonClick = () => { setShowReport(prev => !prev); };
    const handleCloseEachPost = () => { setShowEachPost(false); };


    return (
        <>
            <div className={s.allContainer}>
                {/*setPostしたpostsをmap*/}
                {posts.map((post) => (
                    <div key={post.id} className={s.all}>   {/*post.idで識別*/}
                        <div className={s.flex}>
                            <p className={s.icon}/>
                            <div>
                                <div className={s.topContainer}>
                                    <div className={s.infoContainer}>
                                        <p className={s.name}>{post.name || "Anonymous"}</p>    {/*post.nameがnullのときはAnonymousて表示する*/}
                                        <p className={s.userID}>@user1</p>
                                        <p className={s.time}>{post.timestamp?.toDate().toLocaleString()}</p>
                                    </div>
                                    <button type="button" className={s.editButton} onClick={handleReportButtonClick}>…
                                    </button>
                                </div>
                                {/*content...onClickでpostのデータをeachPostに渡し、eachPostを表示させる*/}
                                <p className={s.content} onClick={() => handleEachPostClick(post)}>{post.tweet}</p>
                                {/*もしimageUrlがあれば*/}
                                {post.imageUrl && <img src={post.imageUrl} alt="投稿画像" className={s.image}/>}

                                {/*リプライとか*/}
                                <div className={s.reactionContainer}>
                                    <div className={s.flex}>    {/*reply*/}
                                        <img alt="リプライアイコン" src="/comment.png" className={s.reply}
                                             onClick={() => handleEachPostClick(post)}/>
                                        <p className={s.reactionText}>0</p>
                                    </div>
                                    <div className={s.flex}>    {/*repost*/}
                                        <div className={s.repost}/>
                                        <p className={s.reactionText}>0</p>
                                    </div>
                                    <div className={s.flex}>    {/*like*/}
                                        {/*post.likedByにcurrentUserIdがあればcutie_heart_after、なければbeforeを表示*/}
                                       <img
                                          alt="いいねアイコン"
                                          src={
                                              hoveredPostId === post.id
                                                  ? "/cutie_heart_after.png" : post.likedBy.includes(currentUserUid)
                                                      ? "/cutie_heart_after.png" : "/cutie_heart_before.png"
                                          }
                                          className={s.like}
                                          onClick={() => handleLikeClick(post.id)}
                                          onMouseEnter={() => setHoveredPostId(post.id)}
                                          onMouseLeave={() => setHoveredPostId(null)}
                                       />
                                        <p className={s.reactionText}>{post.likedBy.length}</p> {/* いいねの数を表示 */}
                                    </div>
                                    <div className={s.flex}>    {/*keep*/}
                                        <div className={s.keep}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/*ReportButton*/}
                {showReport && (
                    <div className={s.reportAllContainer}>
                        <button type="button" onClick={handleReportButtonClick} className={s.closeReportButton}/>
                        <div className={s.reportContainer}>
                            <button type="button" className={s.reportPostButton}>ポストを報告</button>
                            <button type="button" className={s.reportUserButton}>ユーザーを報告</button>
                        </div>
                    </div>
                )}

                {/*EachPostクリックしたとき*/}
                {showEachPost && selectedPost && (
                    <div className={s.eachPostContainer}>
                        <div className={s.headerContainer}>
                            <button type="button" className={s.backButton} onClick={handleCloseEachPost}>←</button>
                            <h1 className={s.headerTitle}>Post</h1>
                            <button type="button" className={s.closeEachPost} onClick={handleCloseEachPost}/>
                        </div>
                        <EachPost post={selectedPost}/> {/* 選択された投稿データを渡す */}
                    </div>
                )}

            </div>
        </>
    );
};

export default Post;
