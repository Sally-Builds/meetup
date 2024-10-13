import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/user";
import { useAppStore } from "../../store/appStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setGettingStartedStep } = useAppStore();

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      toast({
        description: "Login Successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
    onError: (error: any) => {
      console.log(error.response, "from use Mutation error");
      if (error.response && error.response.data) {
        toast({
          description: error.response.data.msg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          description: "error login in",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    },
    onSettled: (_) => {
      setIsLoading(false);
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email) {
      setEmailErr("Email is required");
      if (!password) setPasswordErr("Password is required");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setPasswordErr("Password is required");
      if (!email) setEmailErr("Email is required");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordErr("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }
    console.log(email, password);
    await loginMutation({ email, password });
  };
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>
          <div>
            <button onClick={() => navigate(-1)}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>
          Login Your Account
        </div>
        <div className={styles["bg-img"]}></div>

        <form onSubmit={submit} className={styles["form-container"]}>
          <div className="input-container">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
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

          <button
            className={`${styles["btn"]} ${isLoading && styles["disabled"]}`}
            type="submit"
            // onClick={submit}
          >
            {isLoading ? "Please Wait..." : "Login"}
          </button>
        </form>

        {/* <button
          className={`${styles["btn"]} ${isLoading && styles["disabled"]}`}
          onClick={submit}
        >
          {isLoading ? "Please Wait..." : "Login"}
        </button> */}
      </div>
    </>
  );
};

export default LoginPage;
