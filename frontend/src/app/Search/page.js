'use client';

import MainLayout from "@/components/MainLayout";
import React, { useEffect, useState } from "react";
import s from './search.module.css';  // CSSモジュール
import AccountHeader from "@/components/AccountHeader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import Post from "@/components/post";
import EachPost from "@/components/eachPost";

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsRef = collection(db, "posts");
                const querySnapshot = await getDocs(postsRef);
                const postsData = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id, // IDも含める
                }));
                setAllPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, []);

    // // 投稿をフィルタリングするロジックを修正
    // const getUniqueRepostedPosts = (posts) => {
    //     // repostedBy からResponse情報を展開
    //     const repostedPosts = posts.flatMap(post =>
    //         post.repostedBy?.map(userId => ({
    //             ...post,
    //             userId, // ResponseしたユーザIDを含める
    //             type: 'repost',
    //         })) || []
    //     );
    //
    //     // 投稿者とResponseしたユーザが一致する投稿を除外しつつ、ユニークな投稿を取得
    //     return repostedPosts.reduce((acc, curr) => {
    //         if (
    //             curr.userId !== curr.originalUserId && // 投稿者とResponseユーザが異なる
    //             !acc.some(post => post.id === curr.id) // 重複を防ぐ
    //         ) {
    //             acc.push(curr);
    //         }
    //         return acc;
    //     }, []);
    // };



    // useEffect(() => {
    //     if (allPosts.length > 0) {
    //     // 投稿データを取得した後にフィルタリング処理を実行
    //     const filteredReposts = getUniqueRepostedPosts(allPosts);
    //     setFilteredPosts(filteredPosts);
    //         }
    // }, [allPosts]);

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


    const highlightText = (text, keyword) => {
        if (!keyword.trim()) return <span>{text}</span>; // 検索ワードが空の場合、そのまま表示

        const regex = new RegExp(`(${keyword})`, 'gi'); // 検索ワードを正規表現に変換（大文字小文字を区別しない）
        const parts = text.split(regex);  // 検索ワードでテキストを分割

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
                    {part}
                </mark>
            ) : (
                <span key={index}>{part}</span>
            )
        );
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
                        {filteredPosts.length > 0 ? (
                            filteredPosts
                                .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate())
                                .map((post, index) => (
                                    <Post key={index} searchPost={post} highlightText={highlightText} />
                                ))
                        ) : (
                            <p className={s.noResults}>結果が見つかりませんでした。</p>
                        )}
                    </div>

                    {/*<div className={s.resultsContainer}>*/}
                    {/*    {renderUniqueReposts()}*/}
                    {/*</div>*/}

                </div>
            </MainLayout>
        </>
    );
}

export default Search;