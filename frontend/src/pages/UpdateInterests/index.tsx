import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Stack, useToast } from "@chakra-ui/react";
import { Checkbox, Text } from "@chakra-ui/react";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateUser, uploadImage } from "../../api/user";
import { useUserStore } from "../../store/userStore";

const UpdateInterestPage = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { interests } = useAppStore();
  const { loggedInUser } = useUserStore();

  const { mutateAsync: interestUpdateMutation } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast({
        title: "Successful",
        description: "Interests updated Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.log(error, "from use Mutation error");
      toast({
        title: "Failed",
        description: "Something has gone wrong. Try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    onSettled: (_) => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (checkedItems.length == 0) {
      setErrMsg("Please select some of your interest");
    } else {
      setErrMsg("");
    }
  }, [checkedItems]);

  useEffect(() => {
    if (loggedInUser) {
      console.log(loggedInUser.interests, "here are my interests");
      setCheckedItems(loggedInUser.interests);
    }
  }, []);

  const submit = async () => {
    setIsLoading(true);
    if (checkedItems.length == 0) {
      setIsLoading(false);
      return;
    }
    if (loggedInUser && arraysAreEqual(loggedInUser.interests, checkedItems)) {
      setIsLoading(false);
      return;
    }
    console.log(checkedItems);
    await interestUpdateMutation({ interests: checkedItems });
  };

  const handleCheckboxChange = (sport: string) => {
    setCheckedItems((prev) => {
      if (prev.includes(sport)) {
        return prev.filter((item) => item !== sport); // Uncheck the box, remove from array
      } else {
        return [...prev, sport]; // Check the box, add to array
      }
    });
  };

  const arraysAreEqual = <T extends string | number | boolean>(
    arr1: T[],
    arr2: T[]
  ): boolean =>
    arr1.length === arr2.length &&
    arr1.every((value, index) => value === arr2[index]);

  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Select Your Interests</div>
        <Stack spacing={10} direction="column" className={styles["checkboxes"]}>
          {interests.map((interest, i) => (
            <Checkbox
              spacing={10}
              isChecked={checkedItems.includes(interest.value)}
              onChange={() => handleCheckboxChange(interest.value)}
              key={i}
            >
              <Text fontSize="2xl">{interest.value}</Text>
            </Checkbox>
          ))}
        </Stack>
        {errMsg && <p> {errMsg} </p>}
        <button
          className={`${styles["btn"]} ${isLoading && styles["disabled"]}`}
          onClick={submit}
        >
          {isLoading ? "Please wait..." : "Submit"}
        </button>
      </div>
    </>
  );
};

export default UpdateInterestPage;
