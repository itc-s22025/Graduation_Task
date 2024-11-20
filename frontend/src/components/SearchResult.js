import React from 'react';
import Highlight from './Highlight';  // ハイライトコンポーネントをインポート

const SearchResult = ({ results, highlight }) => {
    return (
        <div>
            {results.length > 0 ? (
                results.map((result, index) => (
                    <div key={index} className="result-item">
                        {/* Highlight コンポーネントを使って検索結果をハイライト */}
                        <p><Highlight text={result} highlight={highlight} /></p>
                    </div>
                ))
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default SearchResult;
