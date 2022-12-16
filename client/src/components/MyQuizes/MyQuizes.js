import React, { useEffect, useState } from "react";
import MyQuiz from "./MyQuiz/MyQuiz";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherQuizes, createQuiz } from "../../actions/quiz";
import styles from "./myQuizes.module.css";
import { useHistory } from "react-router-dom";
import Notify from "../Notify/notify";

function MyQuizes() {
    const user = JSON.parse(localStorage.getItem("profile"));
    const dispatch = useDispatch();
    const history = useHistory();
    const isLanguageEnglish = useSelector((state) => state.language.isEnglish);
    const [quizData, setQuizData] = useState({
        name: "",
        creatorName: `${user?.result.firstName} ${user?.result.lastName}`,
        backgroundImage: "",
        description: "",
        pointsPerQuestion: 1,
        isPublic: true,
        tags: [],
        questionList: [],
    });

    const [isQuizPublic, setIsQuizPublic] = useState(true);
    const [notify,setNotify]=useState(false);

    const handleNotify=(notify)=>{
        setNotify(!notify)
      }

    useEffect(() => {
        dispatch(getTeacherQuizes(user.result._id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const { quizes } = useSelector((state) => state.quiz);

    const handleQuizSubmit = () => {
        dispatch(createQuiz(quizData, history,handleNotify));
    };

    const handleQuizChange = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
        if(notify===true)
        {
            setNotify(!notify)
        }
    };
    

    const NotifyTitleExist={'Eng':'Title already exists !','Vie':'Chủ đề đã tồn tại !'}
    const NotifyTitleEmtpty={'Eng':'Please enter the title !','Vie':'Vui lòng nhập chủ đề !'}

    
    return (   
        <div className={styles["quizes-list"]}>
            {(notify)? <Notify isLan={isLanguageEnglish} text={(quizData.name==="")?NotifyTitleEmtpty:(NotifyTitleExist)} isClose={handleNotify} color="red" />:<></>}
            <div className={styles["quiz-settings"]}>
                <h2>
                    {isLanguageEnglish
                        ? "Create New Quiz!"
                        : "Tạo Bài Kiểm Tra Mới!"}
                </h2>
                <div className={styles["quiz-form"]}>
                    <div className={styles["option-label"]}>
                        <label>{isLanguageEnglish ? "Title" : "Tiêu đề"}</label>
                    </div>
                    <textarea
                        value={quizData.name}
                        type="text"
                        name="name"
                        onChange={handleQuizChange}
                        className={`${styles["quiz-input"]}`}
                        rows="1"
                    />
                    <div className={styles["option-label"]}>
                        <label>
                            {isLanguageEnglish
                                ? "Description (Optional)"
                                : "Mô tả (Không bắt buộc)"}
                        </label>
                    </div>
                    <textarea
                        value={quizData.description}
                        type="text"
                        name="description"
                        onChange={handleQuizChange}
                        className={`${styles["quiz-input"]} ${styles["quiz-input-desc"]}`}
                        rows="4"
                    />
                    <div className={styles["option-buttons"]}>
                        <button
                            onClick={() => {
                                setIsQuizPublic(true);
                                setQuizData({ ...quizData, isPublic: true });
                            }}
                            className={`${styles["option-button"]} ${
                                styles["option-button-public"]
                            } ${
                                isQuizPublic
                                    ? styles["active"]
                                    : styles["disabled"]
                            }`}
                        >
                            {isLanguageEnglish ? "Public" : "Công khai"}
                        </button>
                        <button
                            onClick={() => {
                                setIsQuizPublic(false);
                                setQuizData({ ...quizData, isPublic: false });
                            }}
                            className={`${styles["option-button"]} ${
                                styles["option-button-private"]
                            } ${
                                isQuizPublic
                                    ? styles["disabled"]
                                    : styles["active"]
                            }`}
                        >
                            {isLanguageEnglish ? "Private" : "Riêng tư"}
                        </button>
                    </div>
                    <div className={styles["submit"]}>
                        <button
                            onClick={handleQuizSubmit}
                            className={styles["submit-button"]}
                        >
                            {isLanguageEnglish
                                ? "Create New Quiz"
                                : "Tạo Bài Kiểm Tra Mới"}
                        </button>
                    </div>
                </div>
            </div>
            {quizes.map((quiz) => (
                <MyQuiz key={quiz._id} quiz={quiz} />
            ))}
        </div>
    );
}

export default MyQuizes;
