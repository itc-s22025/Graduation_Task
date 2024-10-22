import s from '@/styles/myCosmeticItems.module.css'


const MyCosmeticItems = () => {
    return(
        <>
            <div className={s.itemContainer}>
                <div className={s.flame}>
                    <div className={s.topContainer}>
                        <button type="button" className={s.heart} /> {/*♡*/}
                        <p className={s.itemType}>アイシャドウ</p>
                        <div className={s.openDayContainer}>
                            <p className={s.dayText}>開封日：</p>
                            <p className={s.dayDate}>2024/10/10 〜</p>
                        </div>
                        <div className={s.updateDayContainer}>
                            <p className={s.dayText}>更新日：</p>
                            <p className={s.dayDate}>2024/12/22</p>
                        </div>
                        <button type="button" className={s.edit}>…</button>
                    </div>
                    <div className={s.middleContainer}>
                        <p className={s.img}/>
                        <div className={s.mMContainer}>
                            <div className={s.eachContainer}>
                                <p className={s.category}>ブランド：</p>
                                <p className={s.eachText}>エクセル</p>
                            </div>
                            <div className={s.eachContainer}>
                                <p className={s.category}>商品名：</p>
                                <p className={s.eachText}>aaa</p>
                            </div>
                            <div className={s.eachContainer}>
                                <div className={s.amountContainer}>
                                    <p className={s.category}>個数：</p>
                                    <p className={s.eachText}>1</p>
                                </div>
                                <div className={s.priceContainer}>
                                    <p className={s.category}>価格：</p>
                                    <p className={s.eachText}>1,230円</p>
                                </div>
                            </div>
                            <div className={s.memoContainer}>
                                <p className={s.category}>メモ：</p>
                                <p className={s.memoText}>あああaaaあいあいうえああいうえおあいうえおあいうえお</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyCosmeticItems;