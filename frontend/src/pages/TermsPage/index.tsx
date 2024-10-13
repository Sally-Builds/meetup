import styles from "./index.module.css";
import { termsPageConstants } from "../../constants/texts.c";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
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
          {termsPageConstants.title}
        </div>
        <div className={styles["bg-img"]}></div>
        <div className={styles["heading"]}>{termsPageConstants.heading}</div>
        <div className={styles["link"]}>
          <a href={termsPageConstants.privacyPolicy.link} target="__blank">
            {termsPageConstants.privacyPolicy.linkText}{" "}
          </a>
        </div>
        <button className={styles["btn"]} onClick={() => navigate("/auth")}>
          {termsPageConstants.buttonText}
        </button>
      </div>
    </>
  );
};

export default TermsPage;
