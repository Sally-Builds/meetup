import { useNavigate } from "react-router-dom";
import { authPageConstants } from "../../constants/texts.c";
import styles from "./index.module.css";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { useState } from "react";
import { ScaleFade } from "@chakra-ui/react";

const SignupPage = () => {
  const [count, setCount] = useState(0);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.type = "date";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      e.target.type = "text";
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>{authPageConstants.title}</div>
        <div className="heading">
          Let's help you meet people with similar interests
        </div>

        <form action="" className={styles["form-container"]}>
          {count == 0 ? (
            <>
              <Input placeholder="Full Name" />
              <Input placeholder="Email" />
              <Input
                placeholder="Date of Birth"
                size="md"
                type="text"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <Input placeholder="Enter your username" />
              <InputGroup>
                <InputLeftAddon>+234</InputLeftAddon>
                <Input type="tel" placeholder="phone number" />
              </InputGroup>
            </>
          ) : (
            <>
              <Input placeholder="Occupation" />
              <Input placeholder="Gender" />
              <Input placeholder="Password" />
              <Input placeholder="Confirm Password" />
            </>
          )}
        </form>

        <div className={styles["btn-group"]}>
          <button
            className={styles["btn"]}
            onClick={() => setCount(count == 0 ? 1 : 0)}
          >
            {count == 0 ? "Next" : "Prev"}
          </button>
          {count == 1 && (
            <>
              <button className={styles["btn"]}>Submit</button>
            </>
          )}
        </div>
        <div className="info">
          Already have an account? <a>Login</a>{" "}
        </div>
      </div>
    </>
  );
};

export default SignupPage;
