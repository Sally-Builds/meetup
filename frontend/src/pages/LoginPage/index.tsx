import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Login Your Account</div>
        <div className={styles["bg-img"]}></div>

        <form action="" className={styles["form-container"]}>
          <Input placeholder="Enter your email" />
          <Input placeholder="Enter your password" type="password" />
        </form>

        <button
          className={styles["btn"]}
          onClick={() => navigate("/getting-started")}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default LoginPage;
