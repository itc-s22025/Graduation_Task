'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import s from '@/styles/post.module.css';
import EachPost from "@/components/eachPost";
import {isBefore, subDays} from 'date-fns';
//firebase
import {auth, db} from "@/firebase";
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

const Post = ({ userId, searchPost, ownPost, pageType }) => {

    const [posts, setPosts] = useState([]); // 投稿リスト
    const [showEachPost, setShowEachPost] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [currentUserUid, setCurrentUserUid] = useState(null);
    const [savedPosts, setSavedPosts] = useState([]); // 保存された投稿のIDを管理
    const router = useRouter();


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
        const unsubscribe = onSnapshot(collection(db, "posts"), orderBy("timestamp", "desc"), async (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({   //snapshot.docs...postsコレクション内のすべてのドキュメントをpostsData配列として返す
                id: doc.id,     //ドキュメントのid(doc.id)をidとする
                ...doc.data(),  //ドキュメントのデータ(doc.id)のシャローコピーを作成
                likedBy: [],    //likedByプロパティ(配列)を追加、いいねしたユーザの情報を保持するプロパティ
                repostedBy: []
            }));

            // ここでpostsDataの内容を確認
            console.log("Fetchedポストデータ:", postsData);
            // likes コレクションから各投稿に対するいいね情報を取得
            const likesSnapshot = await getDocs(collection(db, "likes"));
            const likesData = likesSnapshot.docs.map(doc => doc.data());
            // repostsコレクションから各投稿に対するリポスト情報を取得
            const repostSnapshot = await getDocs(collection(db, "reposts"));
            const repostsData = repostSnapshot.docs.map(doc => doc.data());

            // 各ポストに likedBy と repostedBy 情報を追加
            postsData.forEach(post => {
                // likedBy を設定
                post.likedBy = likesData
                    .filter(like => like.postId === post.id) // postId が一致する likes をフィルタリング
                    .map(like => like.userId);  // userId のみを抽出して likedBy 配列に格納

                // repostedBy を設定
                post.repostedBy = repostsData
                    .filter(repost => repost.postId === post.id) // postId が一致する reposts をフィルタリング
                    .map(repost => repost.userId);  // userId のみを抽出して repostedBy 配列に格納
            });

            let filteredPosts = postsData;

             // searchPostが渡されている場合はそれでさらにフィルタリング...検索機能と関連
            if (searchPost) {
                filteredPosts = filteredPosts.filter(post =>
                    post.tweet.includes(searchPost.tweet)
                );
                console.log("サーチしたポスト:", filteredPosts)
            }

            //ownPostが渡されてたらそれでフィルタリング
            if (ownPost){
                filteredPosts = filteredPosts.filter(post =>
                    post.tweet.includes(ownPost.tweet)
                );
            }

            // フィルタリングされたデータをセット(されてない場合はpostsDataのまま)
            setPosts(filteredPosts);
        });

        //リアルタイム更新の監視を解除　終わりだよ〜
        return () => unsubscribe();
    }, [currentUserUid, searchPost, ownPost]);


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
                   deleteDoc(doc.ref);  //ドキュメント自体を削除
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
                   // いいねされた後に通知を送る
                   const notificationMessage = `${post.name || "Anonymous"}さんがあなたの投稿にいいねしました`;
                   await addDoc(collection(db, "notifications"), {
                       userId: post.uid, // 通知を受け取るユーザーのID（投稿者）
                       type: "like", // 通知タイプ
                       message: notificationMessage, // 通知メッセージ
                       postId: postId, // 投稿ID
                       icon: post.icon,
                       tweet: post.tweet || "", // ツイート内容を追加
                       timestamp: new Date(), // タイムスタンプ
                   });
               }
           }
       } catch (error) {
           console.error("いいね中のエラー: ", error);
       }
   };

    //リポスト機能
    const handleRepostClick = async (postId) => {
        const postIndex = posts.findIndex(post => post.id === postId); // repostするpostのインデックスを取得
        const post = posts[postIndex]; // 投稿群の[postIndex]番目の投稿
        const alreadyReposted = post.repostedBy.includes(currentUserUid);

        try {
            if (alreadyReposted) {  // すでにリポストしているとき
                const repostsQuery = query(collection(db, "reposts"), where("postId", "==", postId), where("userId", "==", currentUserUid));
                const querySnapshot = await getDocs(repostsQuery);
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);  // ドキュメント自体を削除
                });

                // repostedBy配列からcurrentUserUidを除外して、結果をpostsに反映させる
                setPosts(prevPosts => {
                    const updatedPosts = [...prevPosts]; // シャローコピーを作成
                    updatedPosts[postIndex].repostedBy = updatedPosts[postIndex].repostedBy.filter(uid => uid !== currentUserUid);
                    return updatedPosts;
                });

            } else { // まだリポストしていないとき
                if (!post.repostedBy.includes(currentUserUid)) {
                    await addDoc(collection(db, "reposts"), {  // repostsコレクションにドキュメントを追加
                        postId: postId,
                        userId: currentUserUid,
                        timestamp: new Date(),
                    });

                    setPosts(prevPosts => {  // 更新前のpostsの配列に変更を加える
                        const updatedPosts = [...prevPosts]; // シャローコピーを作成
                        if (!updatedPosts[postIndex].repostedBy.includes(currentUserUid)) { // repostedBy配列にcurrentUserUidが存在しない場合
                            updatedPosts[postIndex].repostedBy.push(currentUserUid);    // currentUserUidを追加
                        }
                        return updatedPosts;
                    });

                }
            }
            console.log("ぽすつ:", post.userId)
        } catch (error) {
            console.error("リポスト中のエラー: ", error);
        }
    }

    //show reposted post 元のポストとリポストされたポストを統合して並べ替える
    const getAllPostsIncludingReposts = () => {
        const allPosts = posts.map(post => ({
            ...post,
            type: 'original',  // 元のポストのマーク
        }));

        const repostedPosts = posts.flatMap(post =>
            post.repostedBy.map(repostedUserId => ({
                ...post,
                repostedUserId,  // リポストユーザーのID
                type: 'repost',  // リポストのマーク
                repostTimestamp: new Date(),  // リポストのタイムスタンプ
            }))
        );

        // 元のポストとリポストを結合してtimestamp順に並べ替え
        return [...allPosts, ...repostedPosts].sort(
            (a, b) => {
                // a.timestamp と b.timestamp がすでに Date 型である場合
                const aTimestamp = a.repostTimestamp || a.timestamp;
                const bTimestamp = b.repostTimestamp || b.timestamp;

                // もし Timestamp 型ならば toDate() で Date に変換
                const aDate = aTimestamp instanceof Date ? aTimestamp : aTimestamp.toDate();
                const bDate = bTimestamp instanceof Date ? bTimestamp : bTimestamp.toDate();

                return bDate.getTime() - aDate.getTime();  // getTime() でミリ秒を比較
            }
        );
    };

    // 表示関連
    // showEachPost
    const [selectedPost, setSelectedPost] = useState(null);
    const handleEachPostClick = (post) => {
        setSelectedPost(post);  // クリックした投稿のデータをセット
        setShowEachPost(true);  // <EachPost />を表示
    };

    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [hoveredRepostId, setHoveredRepostId] = useState(null)
    const handleReportButtonClick = () => { setShowReport(prev => !prev); };
    const handleCloseEachPost = () => { setShowEachPost(false); };
    //postのレイアウト
    const paddingLeft = pageType === 'profile' ? s.forProfilePadding : '';
    const flameWidth = pageType === 'profile' ? s.forProfileFlame : '';

    //投稿時刻のフォーマット
    const formatTimestamp = (timestamp) => {
        const postDate = timestamp.toDate();
        const now = new Date();

        // 1週間以上前なら "yyyy/mm/dd" 形式で表示
        if (isBefore(postDate, subDays(now, 7))) {
            return postDate.toLocaleDateString('ja', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }

        // 1週間以内なら経過時間で表示
        const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
        if (diffInMinutes < 60) { return `.${diffInMinutes}m`; }    // 59分以内なら.Om

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) { return `.${diffInHours}h`; }

        const diffInDays = Math.floor(diffInHours / 24);
        return `.${diffInDays}d`;
    };

    const handleKeepClick = async (post) => {
        // Firestoreに保存
        const keepRef = doc(db, "keeps", post.id);
        await setDoc(keepRef, post);

        // 保存した投稿のIDを追加または削除
        setSavedPosts(prev =>
            prev.includes(post.id)
                ? prev.filter(id => id !== post.id)
                : [...prev, post.id]
        );
    };

    return (
        <>
            <div className={`${s.allContainer} ${paddingLeft}`}>
                {/* リポストされたポストを含めたすべてのポストを表示 */}
                {getAllPostsIncludingReposts()
                    .map((post, index) => (
                    <div key={index} className={`${s.all} ${flameWidth} ${savedPosts.includes(post.id) ? s.saved : ''}`}>   {/*post.idで識別*/}
                        {post.replyTo && (
                            <div className={s.replyNotify}>← 返信</div>
                        )}
                        <div className={s.includeIconsContainer}>
                            <div className={s.iconContainer}>
                                <img className={s.iconImage} alt="icon" src={post.icon || "/user_default.png"} onClick={() => router.push(`/Profile/${post.uid}`)} />
                            </div>

                            <div className={s.topContainer}>
                                <div className={s.topMiddleContainer}>
                                    <div className={s.infoContainer}>

                                        <p className={s.name} onClick={() => router.push(`/Profile/${post.uid}`)}>{post.name || "Anonymous"}</p>    {/*post.nameがnullのときはAnonymousて表示する*/}
                                        <p className={s.userID} onClick={() => router.push(`/Profile/${post.uid}`)}>@{post.userId || "user1"}</p>  {/*とりあえずuserIdにしとく*/}
                                        <p className={s.pc}> {post.personalColor || "未設定"}</p>  {/*こっちまだ*/}
                                        <p className={s.time}>{formatTimestamp(post.timestamp)}</p>

                                    </div>
                                    <div className={s.contentContainer} onClick={() => handleEachPostClick(post)}>
                                        {/*content...onClickでpostのデータをeachPostに渡し、eachPostを表示させる*/}
                                        <p className={s.content}>{post.tweet}</p>
                                        {/*もしimageUrlがあれば*/}
                                        {post.imageUrl && <img src={post.imageUrl} alt="投稿画像" className={s.image}/>}
                                    </div>
                                </div>
                                <button type="button" className={s.editButton} onClick={handleReportButtonClick}>…
                                </button>
                            </div>
                        </div>

                        {/*リプライとか reaction*/}
                        <div className={s.reactionContainer}>
                            <div className={s.flex}>    {/*reply*/}
                                <img alt="リプライアイコン" src="/comment.png" className={s.reply}
                                     onClick={() => handleEachPostClick(post)}/>
                                <p className={s.reactionText}>0</p>
                            </div>
                            <div className={s.flex}>    {/*repost*/}
                                <img alt="リポストアイコン"
                                     src={
                                     hoveredRepostId === post.id ? "/repost_after.png" : post.repostedBy.includes(currentUserUid)
                                        ? "/repost_after.png" : "/repost_before.png"}
                                     className={s.repost}
                                     onClick={() => handleRepostClick(post.id)}
                                     onMouseEnter={() => setHoveredRepostId(post.id)}
                                     onMouseLeave={() => setHoveredRepostId(null)}
                                />
                                <p className={s.reactionText}>{post.repostedBy.length}</p>
                            </div>
                            <div className={s.flex}>    {/*like*/}
                                {/*post.likedByにcurrentUserIdがあればcutie_heart_after、なければbeforeを表示*/}
                                <img alt="いいねアイコン"
                                     src={
                                     hoveredPostId === post.id ? "/cutie_heart_after.png" : post.likedBy.includes(currentUserUid)
                                         ? "/cutie_heart_after.png" : "/cutie_heart_before.png"}
                                     className={s.like}
                                     onClick={() => handleLikeClick(post.id)}
                                     onMouseEnter={() => setHoveredPostId(post.id)}
                                     onMouseLeave={() => setHoveredPostId(null)}
                                />
                                <p className={s.reactionText}>{post.likedBy.length}</p> {/* いいねの数を表示 */}
                            </div>
                            <div className={s.flex} onClick={() => handleKeepClick(post)}>
                                <div className={`${s.keep} ${savedPosts.includes(post.id) ? s.keepActive : ''}`} />
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
                        <EachPost post={selectedPost} currentUserUid={currentUserUid}/> {/* 選択された投稿データを渡す */}
                    </div>
                )}

            </div>
        </>
    );
};

export default Post;