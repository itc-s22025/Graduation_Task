'use client';

import MainLayout from "@/components/MainLayout";
import React, {useState} from "react";
import s from './search.module.css'
import AccountHeader from "@/components/AccountHeader";
import Post from "@/app/Post/page";



const Search = () => {

        const [searchKeyword, setSearchKeyword] = useState('');
        const [filteredPosts, setFilteredPosts] = useState([]); // Store filtered posts
        const [allPosts, setAllPosts] = useState([]); // This should be initialized with actual posts

        const handleSearch = () => {
            const results = allPosts.filter(post =>
                post.content.includes(searchKeyword) || post.user.includes(searchKeyword)
            );
            setFilteredPosts(results);
        };

    return (
        <>
            <MainLayout>
                <div className={s.allContainer}>
                    <AccountHeader title="Search"/>
                    <div className={s.searchContainer}>
                    <img alt="search_black" src="/search_black.png" className={s.searchImg}/>
                    <input
                        type="search"
                        className={s.searchBox}
                        placeholder="search..."
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                    />
                    <button type="button" className={s.searchButton} onClick={handleSearch}>Search</button>

                    </div>

                    <div className={s.resultsContainer}>
                        {filteredPosts.map((post, index) => (
                            <div key={index} className={s.resultPost}>
                                <p>{post.user}: {post.content}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </MainLayout>

        </>
    )
}
export default Search;