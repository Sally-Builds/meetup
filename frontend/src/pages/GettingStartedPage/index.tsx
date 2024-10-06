import { useState } from "react";
import styles from "./index.module.css";
import { Image, Input, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Checkbox, CheckboxGroup, Text } from "@chakra-ui/react";
import { gettingStartedConstants } from "../../constants/texts.c";
import { Grid, GridItem } from "@chakra-ui/react";

const GettingStartedPage = () => {
  const [fileUrl, setFileUrl] = useState("https://bit.ly/dan-abramov");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    console.log(url);
    setFileUrl(url);
  };
  return (
    <>
      {/* <div className={styles["container"]}>
        <div className={styles["title"]}>Upload profile image</div>
        <div className={styles["profile-img-container"]}>
          <Image
            borderRadius="full"
            boxSize="200px"
            src={fileUrl}
            alt="Dan Abramov"
          />
          <Input type="file" onChange={handleFileChange} />
        </div>
        <button className={styles["btn"]} onClick={() => navigate("/")}>
          Continue
        </button>
      </div> */}

      {/* <div className={styles["container"]}>
        <div className={styles["title"]}>Select Your Interests</div>
        <Stack spacing={10} direction="column" className={styles["checkboxes"]}>
          {gettingStartedConstants.interests.map((interest, i) => (
            <Checkbox spacing={10}>
              <Text fontSize="2xl">{interest}</Text>
            </Checkbox>
          ))}
          <Checkbox spacing={10}>
            <Text fontSize="2xl">Football</Text>
          </Checkbox>
          <Checkbox spacing={10}>
            <Text fontSize="2xl">Hockey</Text>
          </Checkbox>
        </Stack>

        <button className={styles["btn"]} onClick={() => navigate("btnLink")}>
          Submit
        </button>
      </div> */}

      <div className={styles["container"]}>
        <div className={styles["title"]}>Add Your Photos</div>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem w="100%" h="200" bg="blue.500" />
          <GridItem w="100%" h="200" bg="blue.500" />
        </Grid>
      </div>
    </>
  );
};

export default GettingStartedPage;
