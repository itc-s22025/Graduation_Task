import s from "@/styles/headerTab.module.css";
import home from '@/app/Home/page.module.css'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import Post from "@/components/post";
import { db } from "@/firebase";
import {collection, query, where, getDocs, doc, getDoc, orderBy, addDoc, deleteDoc} from "firebase/firestore";
import AddTab from "@/components/addTab";

const HeaderTab = ({ user }) => {
    //state
    const [showAddTab, setShowAddTab] = useState(false);
    const [tabs, setTabs] = useState([
        { id: "now", title: "Now", content: <div><Post /></div> },
        { id: "following", title: "Following", content: <div>Loading...</div> },
    ]);
    const [focusedTab, setFocusedTab] = useState("now");
    const [followingPosts, setFollowingPosts] = useState([]); // フォロー中ユーザーの投稿
    const [loading, setLoading] = useState(true);

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

        const fetchedTabs = querySnapshot.docs.map((doc) => {
            const data = doc.data();

            // optionsに応じてcontentを動的に設定
            let content;
            if (data.options?.all) {
                content = <Post />; // 全ポスト
            } else if (data.options?.following) {
                content = <div>posts of following users</div>; // フォローユーザーの投稿
            } else {
                content = <div>New Content for Tab {data.title}</div>; // デフォルトコンテンツ
            }

            return {
                id: data.id,
                title: data.title,
                content,
            };
        });

        // `Now` と `Following` タブを維持しつつ、Firestoreのタブを追加
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

            if (postsSnap.empty) {
                console.log("No posts found for following users.");
            } else {
                console.log("Fetched posts:", postsSnap.docs.map(doc => doc.data()));
            }

            const posts = postsSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setFollowingPosts(posts);
            console.log("Updated followingPosts:", posts); // state update後の値

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
                    ? { ...tab, content: loading ? <div>Loading...</div> : (
                            <div>{followingPosts.length > 0 ? followingPosts.map((post) => <Post key={post.id} searchPost={post} />) : <div>No posts found.</div>}</div>
                        )
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

        console.log("options::", options.all)
        const newTabId = `tab${tabs.length + 1}`;

        const newTab = {
            id: newTabId,
            title: tabName,
            content: <div>New Content for Tab {tabName}</div>,
        };

        try {   // Firestoreに新しいタブを追加
            const docRef = await addDoc(collection(db, "homesTab"), {
                id: newTabId,
                title: newTab.title,
                content: `New Content for Tab ${tabName}`,
                uid: user.uid,
                options,
            });

            // Firestoreに保存したタブを状態に追加
            setTabs((prevTabs) => [...prevTabs, newTab]);
            console.log("新しいタブがFirestoreに追加されました:", docRef.id);
        } catch (error) {
            console.error("タブの追加に失敗しました:", error);
        }
    };


    //タブ削除
    const handleDeleteTab = async (tabId) => {
        if (!user) return;

        // 確認ダイアログを表示
        const isConfirmed = window.confirm(`タブを削除しますか？`);
        if (!isConfirmed) return;

        try {
            // Firestoreから削除
            const tabDocRef = doc(db, "homesTab", tabId); // tabIdがFirestoreのドキュメントIDと一致することを確認
            await deleteDoc(tabDocRef);  // 削除処理

            // 状態から削除
            setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
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
                                // tabIndex={focusedTab === 'now' ? 0 : index + 1}  // "All" タブを一番最初に表示
                                onFocus={() => handleFocus(tab.id)}
                                style={{
                                    zIndex: focusedTab === tab.id
                                        ? 4  // フォーカスしているタブが最前面
                                        : (tab.id === 'following' ? 2 : 1),
                                    backgroundColor: tab.id === "now" ? "#fff"
                                        : tab.id === "following" ? "#FFDCDD" : "#FFBFC0", //背景色
                                    color: tab.id === "now" ? "#FF989A" : tab.id === "following" ? "#FF989A" : "#fff",  //文字色
                                    borderBottom: tab.id !== "now" ? "none" : ""
                                }}
                            >
                                {/*{tab.title}*/}

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

                {tabs.map((tab) => (
                    <TabPanel key={tab.id}>
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
