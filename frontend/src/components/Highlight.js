import React from 'react';

const Highlight = ({ text, highlight }) => {
    // ハイライトする文字列が空の場合はそのままテキストを返す
    if (!highlight) return <span>{text}</span>;

    // ハイライト対象のテキストを <mark> タグで囲む
    const highlightedText = text.split(highlight).join(`<mark>${highlight}</mark>`);

    // dangerouslySetInnerHTML を使ってHTMLを挿入
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

export default Highlight;