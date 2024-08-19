import s from '@/styles/addTab.module.css'

const AddTab = () => {
    return(
        <>
            <div className={s.container}>
                <h1 className={s.h1}>Add a new tab</h1>
                <form>
                    <div className={s.tabName}>
                        <label className={s.title}>New tab name: </label>
                        <input type="text" onChange={(e) => console.log(e)} placeholder="enter tab name" className={s.inputName}/>
                    </div>
                    <div className={s.showPostsFromContainer}>
                        <p className={s.title}>Show posts from: </p>

                        <div className={s.checkboxes}>
                            <input type="checkbox" name="all" className={s.checkbox}/>
                            <label htmlFor="all" className={s.checkboxLabel}>all users</label>

                            <input type="checkbox" name="following" className={s.checkbox}/>
                            <label htmlFor="following" className={s.checkboxLabel}>following users</label>

                            <input type="checkbox" name="bluebase" className={s.checkbox}/>
                            <label htmlFor="bluebase" className={s.checkboxLabel}>blue-base users</label>

                            <input type="checkbox" name="yellowbase" className={s.checkbox}/>
                            <label htmlFor="yellowbase" className={s.checkboxLabel}>yellow-base users</label>

                            <input type="checkbox" name="yellowbase" className={s.checkbox}/>
                            <label htmlFor="yellowbase" className={s.checkboxLabel}>users who like:</label>
                            <input type="text" placeholder="(例)〇〇くん" className={s.checkboxInput}/>
                        </div>
                    </div>
                    <input type="submit" onChange={(e) => console.log(e)} value="Save" className={s.save}/>
                </form>
            </div>
        </>
    )
}

export default AddTab;