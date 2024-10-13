import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles["container"]}>
        <nav className={styles["nav"]}>
          <div>
            <button onClick={() => navigate(-1)}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>

          <ul>
            <li>
              <button type="button" className={styles["icon-button"]}>
                <i className="fa-solid fa-sliders"></i>
              </button>
            </li>
            <li>
              <button type="button" className={styles["icon-button"]}>
                <i className="fa-regular fa-bell"></i>
                {/* <span className="icon-button__badge">2</span> */}
              </button>
            </li>
            <li>
              <button type="button" className={styles["icon-button"]}>
                <i className="fa-regular fa-comments"></i>
                <span className="icon-button__badge">12</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
