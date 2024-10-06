import styles from "./landing.module.css";
import { landingPageConstants } from "../../constants/texts.c";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>{landingPageConstants.title}</div>
        <div className={styles["bg-img"]}></div>
        <div className={styles["heading"]}>{landingPageConstants.heading}</div>
        <button
          className={styles["btn"]}
          onClick={() => navigate("/terms-of-service")}
        >
          {landingPageConstants.buttonText}
        </button>
      </div>
    </>
  );
};

export default LandingPage;
