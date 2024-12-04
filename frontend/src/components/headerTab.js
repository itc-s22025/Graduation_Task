import s from "@/styles/headerTab.module.css";
import home from '@/app/Home/page.module.css'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import Post from "@/components/post";
import { db } from "@/firebase";
import {collection, query, where, getDocs, doc, getDoc, orderBy, addDoc, deleteDoc} from "firebase/firestore";
import AddTab from "@/components/addTab";

const HeaderTab = ({ user }) => {
    const [showAddTab, setShowAddTab] = useState(false);
    const [tabs, setTabs] = useState([
        { id: "now", title: "Now", content: <div><Post /></div> },
        { id: "following", title: "Following", content: <div>Loading...</div> },
    ]);
    const [focusedTab, setFocusedTab] = useState("now");
    const [followingPosts, setFollowingPosts] = useState([]); // フォロー中ユーザーの投稿
    const [loading, setLoading] = useState(true);

    const blueBase = ["ブルベ夏", "ブルベ冬"]
    const yellowBase = ["イエベ春", "イエベ秋"]


    // Firestoreからタブデータを取得
   const fetchTabs = async () => {
    if (!user) return;

    try {
        const tabsQuery = query(
            collection(db, "homesTab"),
            where("uid", "==", user.uid),
            orderBy("id")
        );

        const querySnapshot = await getDocs(tabsQuery);

        // 非同期処理の結果を Promise.all で解決
        const fetchedTabs = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const data = doc.data();

                // options に応じて content を動的に設定
                let content;
                if (data.options?.all) {
                    content = <Post />; // 全ポスト
                } else if (data.options?.following) {
                    content = <div>posts of following users</div>; // フォローユーザーの投稿
                } else if (data.options?.bluebase) {
                    // "ブルベ" ユーザーの投稿を取得
                    const blueBaseQuery = query(
                        collection(db, "users"),
                        where("personalColor", "in", blueBase)
                    );
                    const blueBaseSnap = await getDocs(blueBaseQuery);
                    const blueBaseUserIds = blueBaseSnap.docs.map(userDoc => userDoc.id);

                    if (blueBaseUserIds.length === 0) {
                        content = <div>No posts found for Blue Base users.</div>;
                    } else {
                        const postsQuery = query(
                            collection(db, "posts"),
                            where("uid", "in", blueBaseUserIds),
                            orderBy("timestamp", "desc")
                        );
                        const postsSnap = await getDocs(postsQuery);
                        const posts = postsSnap.docs.map(postDoc => ({
                            id: postDoc.id,
                            ...postDoc.data(),
                        }));

                        content = posts.length > 0 ? (
                            <div>
                                {posts.map(post => (
                                    <Post key={post.id} searchPost={post} />
                                ))}
                            </div>
                        ) : (
                            <div>No posts found for Blue Base users.</div>
                        );
                    }
                } else if (data.options?.yellowbase) {
                    // "イエベ" ユーザーの投稿を取得
                    const yellowBaseQuery = query(
                        collection(db, "users"),
                        where("personalColor", "in", yellowBase)
                    );
                    const yellowBaseSnap = await getDocs(yellowBaseQuery);
                    const yellowBaseUserIds = yellowBaseSnap.docs.map(userDoc => userDoc.id);

                    if (yellowBaseUserIds.length === 0) {
                        content = <div>No posts found for Yellow Base users.</div>;
                    } else {
                        const postsQuery = query(
                            collection(db, "posts"),
                            where("uid", "in", yellowBaseUserIds),
                            orderBy("timestamp", "desc")
                        );
                        const postsSnap = await getDocs(postsQuery);
                        const posts = postsSnap.docs.map(postDoc => ({
                            id: postDoc.id,
                            ...postDoc.data(),
                        }));

                        content = posts.length > 0 ? (
                            <div>
                                {posts.map(post => (
                                    <Post key={post.id} searchPost={post} />
                                ))}
                            </div>
                        ) : (
                            <div>No posts found for Yellow Base users.</div>
                        );
                    }
                } else {
                    content = <div>New Content for Tab {data.title}</div>; // デフォルトコンテンツ
                }

                return {
                    id: data.id,
                    docId: doc.id, // Firestore のドキュメント ID
                    title: data.title,
                    content,
                };
            })
        );

        // `Now` と `Following` タブを維持しつつ、Firestore のタブを追加
        setTabs((prevTabs) => [
            ...prevTabs.filter((tab) => tab.id === "now" || tab.id === "following"),
            ...fetchedTabs,
        ]);
    } catch (error) {
        console.error("タブデータの取得に失敗しました:", error);
    }
};


    //following postsのフェッチ
    const fetchFollowingPosts = async () => {
        if (!user) return;

        try {
            // ログインユーザーのfollowingを取得
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                console.error("ユーザードキュメントが存在しません");
                return;
            }

            //following
            let following = userDocSnap.data().following || [];
            // 自分自身を追加
            following = [...following, user.uid];

            if (following.length === 0) {   //followユーザがいなければ
                setFollowingPosts([]);
                setLoading(false);
                return;
            }

            // フォロー中のユーザーの投稿を取得
            const postsQuery = query(
                collection(db, "posts"),
                where("uid", "in", following),
                orderBy("timestamp", "desc")
            );
            const postsSnap = await getDocs(postsQuery);

            const posts = postsSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setFollowingPosts(posts);

        } catch (error) {
            console.error("フォロー中の投稿取得エラー:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchTabs();
            await fetchFollowingPosts();
        };
        fetchData();
    }, [user]);

    // `following` タブを更新
    useEffect(() => {
        setTabs((prevTabs) =>
            prevTabs.map((tab) =>
                tab.id === "following"
                    ? {
                        ...tab,
                        content: loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div>
                                {followingPosts.length > 0 ? (
                                    followingPosts.map((post) => (
                                        <Post key={post.id} searchPost={post} />
                                    ))
                                ) : (
                                    <div>No posts found.</div>
                                )}
                            </div>
                        ),
                    }
                    : tab
            )
        );
    }, [followingPosts, loading]);

    //tab関連
    const handleFocus = (tabId) => { setFocusedTab(tabId); };
    const handleAddClick = () => { setShowAddTab(prev => !prev); }  // AddTabを表示
    //タブ追加
    const handleAddTab = async (tabName, options) => {
        // タブ名の文字数をチェック
        if (tabName.length > 10) {
            alert("タブ名は10文字以内で入力してください");
            return; // 処理を中断
        }

        const newTabId = `tab${tabs.length + 1}`;

        // optionsに応じたコンテンツを設定 リロード前
        let newContent;
        if (options.bluebase) {
            // "ブルベ"ユーザーのUIDを取得
            const blueBaseQuery = query(
                collection(db, "users"),
                where("personalColor", "in", blueBase)
            );
            const blueBaseSnap = await getDocs(blueBaseQuery);
            const blueBaseUserIds = blueBaseSnap.docs.map(doc => doc.id);

            if (blueBaseUserIds.length === 0) {
                newContent = <div>No posts found for Blue Base users.</div>;
            } else {
                // "ブルベ"ユーザーの投稿を取得
                const postsQuery = query(
                    collection(db, "posts"),
                    where("uid", "in", blueBaseUserIds),
                    orderBy("timestamp", "desc")
                );
                const postsSnap = await getDocs(postsQuery);

                const posts = postsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (posts.length === 0) {
                    newContent = <div>No posts found for Blue Base users.</div>;
                } else {
                    newContent = (
                        <div>
                            {posts.map(post => (
                                <Post key={post.id} searchPost={post}/>
                            ))}
                        </div>
                    );
                }
            }
        } else if (options.yellowbase) {
            // "ブルベ"ユーザーのUIDを取得
            const yellowBaseQuery = query(
                collection(db, "users"),
                where("personalColor", "in", yellowBase)
            );
            const yellowBaseSnap = await getDocs(yellowBaseQuery);
            const yellowBaseUserIds = yellowBaseSnap.docs.map(doc => doc.id);

            if (yellowBaseUserIds.length === 0) {
                newContent = <div>No posts found for Yellow Base users.</div>;
            } else {
                // "イエベ"ユーザーの投稿を取得
                const postsQuery = query(
                    collection(db, "posts"),
                    where("uid", "in", yellowBaseUserIds),
                    orderBy("timestamp", "desc")
                );
                const postsSnap = await getDocs(postsQuery);

                const posts = postsSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (posts.length === 0) {
                    newContent = <div>No posts found for Yellow Base users.</div>;
                } else {
                    newContent = (
                        <div>
                            {posts.map(post => (
                                <Post key={post.id} searchPost={post}/>
                            ))}
                        </div>
                    );
                }
            }
        }

        else if (options.all) {
            newContent = <Post />;
        } else if (options.following) {
            newContent = (
                <div>
                    {followingPosts.length > 0 ? (
                        followingPosts.map((post) => (
                            <Post key={post.id} searchPost={post} />
                        ))
                    ) : (
                        <div>No posts found.</div>
                    )}
                </div>
            );
        } else {
            newContent = <div>New Content for Tab {tabName}</div>;
        }

        const newTab = {
            id: newTabId,
            title: tabName,
            content: newContent,
        };

        try {
            const docRef = await addDoc(collection(db, "homesTab"), {
                id: newTabId,
                title: newTab.title,
                uid: user.uid,
                options,
            });

            const newTabWithDocId = {
                ...newTab,
                docId: docRef.id, // FirestoreのドキュメントID
            };

            setTabs((prevTabs) => [...prevTabs, newTabWithDocId]);
            console.log("新しいタブがFirestoreに追加されました:", docRef.id);
        } catch (error) {
            console.error("タブの追加に失敗しました:", error);
        }
    };

    //タブ削除
    const handleDeleteTab = async (tabId) => {
        if (!user) return;

        const isConfirmed = window.confirm(`タブを削除しますか？`);
        if (!isConfirmed) return;

        try {
            // 対応するタブを取得
            const tabToDelete = tabs.find((tab) => tab.id === tabId);

            if (!tabToDelete || !tabToDelete.docId) {
                console.error("削除対象のタブが見つかりません");
                return;
            }

            // Firestoreから削除
            const tabDocRef = doc(db, "homesTab", tabToDelete.docId);
            await deleteDoc(tabDocRef);

            // 状態から削除
            setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
            console.log(`タブ(${tabToDelete.title})を削除しました`);
        } catch (error) {
            console.error("タブ削除エラー:", error);
        }
    };



    return (
        <>
            <Tabs>
                <TabList className={s.all}>
                    <ul className={s.ul}>
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.id}
                                className={`${s.tabs} ${focusedTab === tab.id ? s.zIndex4 : ''}`}
                                tabIndex={0}
                                onFocus={() => handleFocus(tab.id)}
                                style={{
                                    zIndex: focusedTab === tab.id
                                        ? 4  // フォーカスしているタブが最前面
                                        : (tab.id === 'following' ? 3 :
                                            tab.id === 'tab3' ? 2 :
                                                tab.id === 'tab4' ? 1 : 1),
                                    backgroundColor: tab.id === "now" ? "#fff"
                                        : tab.id === "following" ? "#FFDCDD"
                                            : tab.id === "tab3" ? "#FFBFC0" : "#ffa9a9", //背景色
                                    color: tab.id === "now" ? "#FF989A" : tab.id === "following" ? "#FF989A" : "#fff",  //文字色
                                    borderBottom: tab.id !== "now" ? "none" : ""
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <p className={s.tabTitle}>{tab.title}</p>
                                    {tab.id !== "now" && tab.id !== "following" && (
                                        <button
                                            onClick={(e) => {   e.stopPropagation(); // タブフォーカスイベントを防止
                                                        handleDeleteTab(tab.id);}}
                                            className={s.deleteButton}
                                        >×</button>
                                    )}
                                </div>
                            </Tab>
                        ))}
                        <button onClick={handleAddClick} className={s.addButton}>+</button>
                    </ul>
                </TabList>

                {tabs.map((tab, index) => (
                    <TabPanel key={`${tab.id}-${index}`}>
                        <article className={s.article}>
                            {tab.content}
                        </article>
                    </TabPanel>
                ))}
            </Tabs>


            {/* タブ追加ボタン押したとき */}
                {showAddTab && (
                    <div className={home.addTabOverlay}>
                        <div className={home.addTabContent}>
                            <AddTab onSubmit={(tabName, options) => {
                                handleAddTab(tabName, options);
                                setShowAddTab(false); // ダイアログを閉じる
                            }}/>
                            <button onClick={handleAddClick} className={home.buttonCancel}>Cancel</button>
                        </div>
                    </div>
                )}
        </>
    );
};

export default HeaderTab;
