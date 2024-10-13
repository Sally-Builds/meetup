import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Image, Input, Stack } from "@chakra-ui/react";
import { Checkbox, Text } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useAppStore } from "../../store/appStore";
import { useUserStore } from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateUser, uploadImage } from "../../api/user";

const ProfileImageUpload = ({ nextStep }: { nextStep: () => void }) => {
  const [fileUrl, setFileUrl] = useState(
    "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
  );
  const [file, setFile] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: profileUploadMutation } = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      nextStep();
    },
    onError: (error) => {
      console.log(error, "from use Mutation error");
    },
    onSettled: (_) => {
      setIsLoading(false);
    },
  });

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    console.log(url);
    setFileUrl(url);
    setErrMsg("");
  };

  const submit = async () => {
    setIsLoading(true);
    if (!file) {
      setErrMsg("Please upload your profile image to continue");
      setIsLoading(false);
      return;
    }
    const form = new FormData();
    form.append("profile_image", file);

    await profileUploadMutation({ form, type: "profile" });
  };
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Upload profile image</div>
        <div className={styles["profile-img-container"]}>
          <Image
            borderRadius="full"
            boxSize="200px"
            src={fileUrl}
            alt="Dan Abramov"
          />
          <Input type="file" onChange={handleFileChange} />
          {errMsg && <p> {errMsg} </p>}
        </div>
        <button
          className={`${styles["btn"]} ${isLoading && styles["disabled"]}`}
          onClick={submit}
        >
          {isLoading ? "Uploading..." : "Continue"}
        </button>
      </div>
    </>
  );
};

const Interests = ({ nextStep }: { nextStep: () => void }) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { interests } = useAppStore();

  const { mutateAsync: interestUpdateMutation } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      nextStep();
      navigate("/dashboard");
    },
    onError: (error) => {
      console.log(error, "from use Mutation error");
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

  const submit = async () => {
    setIsLoading(true);
    if (checkedItems.length == 0) {
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

const ImagesUpload = ({ nextStep }: { nextStep: () => void }) => {
  const submit = async () => {
    nextStep();
  };
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["title"]}>Add Your Photos</div>
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={1}
          className={styles["grid"]}
        >
          <GridItem w="100%" h="200" bg="blue.500">
            <img
              src="/images/landing.png"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </GridItem>
          <GridItem w="100%" h="200" className={styles["grid-item"]}>
            <Text fontSize="3xl">
              <button>
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </button>
            </Text>
          </GridItem>
          <GridItem w="100%" h="200" className={styles["grid-item"]}>
            <Text fontSize="3xl">
              <button>
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </button>
            </Text>
          </GridItem>
          <GridItem w="100%" h="200" className={styles["grid-item"]}>
            <Text fontSize="3xl">
              <button>
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </button>
            </Text>
          </GridItem>
          <GridItem w="100%" h="200" className={styles["grid-item"]}>
            <Text fontSize="3xl">
              <button>
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </button>
            </Text>
          </GridItem>
          <GridItem w="100%" h="200" className={styles["grid-item"]}>
            <Text fontSize="3xl">
              <button>
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </button>
            </Text>
          </GridItem>
        </Grid>
      </div>
    </>
  );
};

const GettingStartedPage = () => {
  const { gettingStartedStep, setGettingStartedStep } = useAppStore();
  // const navigate = useNavigate();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     navigate("/dashboard");
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  const nextStep = () => {
    setGettingStartedStep(gettingStartedStep + 1);
  };

  return (
    <>
      {gettingStartedStep === 1 && <ProfileImageUpload nextStep={nextStep} />}
      {gettingStartedStep === 2 && <Interests nextStep={nextStep} />}
      {/* {gettingStartedStep === 3 && <ImagesUpload nextStep={nextStep} />} */}
    </>
  );
};

export default GettingStartedPage;
