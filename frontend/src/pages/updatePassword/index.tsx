import { Button, Input, InputGroup, useToast } from "@chakra-ui/react";
import { useState } from "react";
import styles from "./index.module.css";
import { updatePassword } from "../../api/user";

const Demo = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [errOld, setErrOld] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errNew, setErrNew] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errConfirm, setErrConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const submitForm = async () => {
    setIsLoading(true);
    setErrOld("");
    setErrNew("");
    setErrConfirm("");
    if (
      oldPassword.length < 8 ||
      newPassword.length < 8 ||
      confirmNewPassword.length < 8
    ) {
      const errMsg = "Password must be at least 8 characters long";
      if (oldPassword.length < 8) setErrOld(errMsg);
      if (newPassword.length < 8) setErrNew(errMsg);
      if (confirmNewPassword.length < 8) setErrConfirm(errMsg);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrConfirm("Password does not match");
      setIsLoading(false);
      return;
    }

    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      await updatePassword(data);
      toast({
        title: "Successful",
        description: "Password Updated Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.log(error.response.data.msg);
      toast({
        title: "Failed",
        description: error.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsLoading(false);
    }

    console.log(data);
  };

  return (
    <div className={styles["container"]}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="password"
          placeholder="Enter password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </InputGroup>
      {errOld && <p> {errOld} </p>}
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </InputGroup>
      {errNew && <p> {errNew} </p>}
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="password"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </InputGroup>
      {errConfirm && <p> {errConfirm} </p>}
      <Button color="teal" onClick={submitForm} disabled={isLoading}>
        Submit
      </Button>
    </div>
  );
};

export default Demo;
