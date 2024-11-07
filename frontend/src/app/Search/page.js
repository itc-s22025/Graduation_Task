'use client';

import MainLayout from "@/components/MainLayout";
import React, { useEffect, useState } from "react";
import s from './search.module.css';  // CSSモジュール
import AccountHeader from "@/components/AccountHeader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Post from "@/components/post";

const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);

    // Firebaseから投稿データを取得
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsRef = collection(db, "posts");
                const querySnapshot = await getDocs(postsRef);
                const postsData = querySnapshot.docs.map(doc => doc.data());
                setAllPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
        loadSearchHistory();
    }, []);

    // 検索結果をフィルタリング
    useEffect(() => {
        const results = allPosts.filter(post =>
            (post.content && post.content.includes(searchKeyword)) ||
            (post.user && post.user.includes(searchKeyword))
        );
        setFilteredPosts(results);
    }, [searchKeyword, allPosts]);

    // 検索履歴を保存
    const saveSearchHistory = (keyword) => {
        if (keyword) {
            const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
            if (!history.includes(keyword)) {
                history.push(keyword);
                localStorage.setItem("searchHistory", JSON.stringify(history));
                setSearchHistory(history);
            }
        }
    };

    // ローカルストレージから検索履歴を読み込み
    const loadSearchHistory = () => {
        const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        setSearchHistory(history);
    };

    // 履歴項目をクリックして検索ボックスに入力
    const handleHistoryClick = (keyword) => {
        setSearchKeyword(keyword);
    };

    // 履歴項目を削除
    const handleDeleteHistory = (keyword) => {
        const updatedHistory = searchHistory.filter(item => item !== keyword);
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    };
    // Enterキーを押したときに検索を実行
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 検索を実行する関数
    const handleSearch = async () => {
        if (searchKeyword.trim() !== '') {
            try {
                const postsRef = collection(db, "posts");
                const querySnapshot = await getDocs(postsRef);
                const postsData = querySnapshot.docs.map(doc => doc.data());

                // 検索結果をフィルタリング
                const results = postsData.filter(post =>
                    (post.name && post.name.includes(searchKeyword)) ||
                    (post.tweet && post.tweet.includes(searchKeyword))
                );

                // 検索結果を表示
                if (results.length > 0) {
                    setFilteredPosts(results); // 検索結果をセット
                } else {
                    setFilteredPosts([]); // 結果が見つからなかった場合は空にする
                }

                // 検索履歴に追加
                saveSearchHistory(searchKeyword);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
    };



    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <div className={s.topContainer}>
                        <AccountHeader title="Search"/>
                        <div className={s.searchContainer}>
                            <img alt="search_black" src="/search_black.png" className={s.searchImg}/>
                            <input
                                type="search"
                                className={s.searchBox}
                                placeholder="search..."
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button type="button" className={s.searchButton} onClick={handleSearch}>Search</button>

                        </div>
                    </div>

                    {/* 検索履歴を表示 */}
                    {searchKeyword && (
                        <div className={s.historyContainer}>
                            <ul>
                                {searchHistory.map((keyword, index) => (
                                    <li key={index} className={s.historyItem}>
                                        <span className={s.historyKeyword} onClick={() => handleHistoryClick(keyword)}>
                                            {keyword}
                                        </span>
                                        <button className={s.historyDelete} onClick={() => handleDeleteHistory(keyword)}>×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 検索結果を表示 */}
                    <div className={s.resultsContainer}>
                        {filteredPosts.length > 0 ? (filteredPosts
                                .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())  // timestampで降順に並べ替え
                                .map((post, index) => {
                            return(
                                <>
                                    <Post searchPost={post} key={index}/>
                                </>
                                )
                            })
                        ) : (
                            <p className={s.noResults}>結果が見つかりませんでした。</p>
                        )}
                    </div>

                </div>
            </MainLayout>
        </>
    );
}

export default Search;