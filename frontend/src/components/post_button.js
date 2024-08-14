import s from '../styles/post_button.module.css';

const PostButton = () => {
    return(
        <>
            <button className={s.buttonA}>+</button>
            <button className={s.buttonB}>投稿</button>
            <button className={s.buttonC}>レビュー</button>
        </>
    )
}

export default PostButton;