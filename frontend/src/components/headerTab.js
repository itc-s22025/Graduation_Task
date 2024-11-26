import s from "@/styles/headerTab.module.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useState } from "react";
import Post from "@/components/post";
import { db } from "@/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const HeaderTab = ({ user }) => {
    const [tabs, setTabs] = useState([
        { id: "now", title: "Now", content: <div><Post /></div> },
        { id: "following", title: "Following", content: <div>Loading...</div> },
    ]);
    const [focusedTab, setFocusedTab] = useState("now");
    const [followingPosts, setFollowingPosts] = useState([]); // フォロー中ユーザーの投稿
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

                const following = userDocSnap.data().following || [];
                if (following.length === 0) {
                    setFollowingPosts([]);
                    setLoading(false);
                    return;
                }

                console.log("flw.len;", following.length);

                // フォロー中のユーザーの投稿を取得
                const postsQuery = query(
                    collection(db, "posts"),
                    where("uid", "in", following)
                );
                const postsSnap = await getDocs(postsQuery);
                console.log("following::", following);

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
        fetchFollowingPosts();
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

    const handleFocus = (tabId) => {
        setFocusedTab(tabId);
    };

    const handleAddTab = () => {
        const newTabId = `tab${tabs.length + 1}`;
        const newTab = {
            id: newTabId,
            title: `New Tab ${tabs.length + 1}`,
            content: <div>New Content for Tab {tabs.length + 1}</div>,
        };

        setTabs([...tabs, newTab]);
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
                            >
                                {tab.title}
                            </Tab>
                        ))}
                        <button onClick={handleAddTab} className={s.addButton}>+</button>
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
        </>
    );
};

export default HeaderTab;
