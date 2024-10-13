import { useNavigate } from "react-router-dom";
import { authPageConstants } from "../../constants/texts.c";
import styles from "./index.module.css";

const AuthPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>
          <div>
            <button onClick={() => navigate(-1)}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>
          {authPageConstants.title}
        </div>
        <div className={styles["bg-img"]}></div>
        <div className={styles["btn-group"]}>
          {authPageConstants.btnGroup.map((btn, i) => (
            <button
              key={i}
              className={styles["btn"]}
              onClick={() => navigate(btn.btnLink)}
            >
              {btn.btnText}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AuthPage;
