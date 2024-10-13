import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/user";
import { useAppStore } from "../../store/appStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setGettingStartedStep } = useAppStore();

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      if (!user.profile_image) {
        navigate("/getting-started");
      }

      if (user.interests.length == 0) {
        setGettingStartedStep(2);
        navigate("/getting-started");
      }

      if (user.images.length == 0) {
        setGettingStartedStep(3);
        navigate("/getting-started");
      }

      navigate("/dashboard");
    },
    onError: (error) => {
      console.log(error, "from use Mutation error");
    },
    onSettled: (_) => {
      setIsLoading(false);
    },
  });

  const submit = async () => {
    setIsLoading(true);
    if (!email) {
      setEmailErr("Email is required");
      if (!password) setPasswordErr("Password is required");
      return;
    }
    if (!password) {
      setPasswordErr("Password is required");
      if (!email) setEmailErr("Email is required");
      return;
    }
    console.log(email, password);
    await loginMutation({ email, password });
  };
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Login Your Account</div>
        <div className={styles["bg-img"]}></div>

        <form onSubmit={submit} className={styles["form-container"]}>
          <div className="input-container">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailErr && <p> {emailErr} </p>}
          </div>
          <div className="input-container">
            <Input
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordErr && <p> {passwordErr} </p>}
          </div>
        </form>

        <button
          className={`${styles["btn"]} ${isLoading && styles["disabled"]}`}
          onClick={submit}
        >
          {isLoading ? "Please Wait..." : "Login"}
        </button>
      </div>
    </>
  );
};

export default LoginPage;
