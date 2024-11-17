import {
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  useToast,
} from "@chakra-ui/react";
import styles from "./index.module.css";
import { useUserStore } from "../../store/userStore";
import { useEffect, useState } from "react";
import { IUpdateUserDTO, updateUser, uploadImage } from "../../api/user";

const ProfilePage = () => {
  const { loggedInUser } = useUserStore();
  const [full_name, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const toast = useToast();

  useEffect(() => {
    if (loggedInUser) {
      setFullName(loggedInUser.full_name);
      setUsername(loggedInUser.username);
      setPhone(loggedInUser.phone);
      setOccupation(loggedInUser.occupation);
      setGender(loggedInUser.gender);
      setFileUrl(loggedInUser.profile_image.url);

      setDob(loggedInUser.dob);
    }
  }, []);

  const submit = async () => {
    console.log(file, fileUrl);
    setIsLoading(true);
    let data: any = {};
    if (full_name && full_name !== loggedInUser?.full_name)
      data.full_name = full_name;
    if (username && username !== loggedInUser?.username)
      data.username = username;
    if (phone && phone !== loggedInUser?.phone) data.phone = phone;
    if (occupation && occupation !== loggedInUser?.occupation)
      data.occupation = occupation;
    if (gender && gender !== loggedInUser?.gender) data.gender = gender;
    if (dob && dob !== loggedInUser?.dob) data.dob = dob;

    if (Object.keys(data).length === 0 && !file) {
      console.log(Object.keys(data).length, "data");
      setIsLoading(false);
      return;
    }

    try {
      if (Object.keys(data).length > 0) {
        await updateUser(data as IUpdateUserDTO);
      }
      if (file && fileUrl) {
        const form = new FormData();
        form.append("profile_image", file);
        await uploadImage({ form, type: "profile" });
      }
      toast({
        title: "Successful",
        description: "Profile updated Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.response.data.msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    console.log(url);
    setFileUrl(url);
    setErrMsg("");
  };

  const handleImageClick = () => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      (fileInput as HTMLElement).click();
    }
  };

  return (
    <>
      {loggedInUser && (
        <>
          <div className={styles["container"]}>
            <Image
              borderRadius="full"
              boxSize="180px"
              src={fileUrl}
              alt="Profile Image"
              className={styles["image-upload"]}
              onClick={handleImageClick}
            />
            <Input hidden type="file" onChange={handleFileChange} />
          </div>
          <div className={styles["form-container"]}>
            <InputGroup display={"flex-col"}>
              <label>Full name</label>
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Full name"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
              />
            </InputGroup>
            <InputGroup display={"flex-col"}>
              <label>Username</label>
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>
            <InputGroup display={"flex-col"}>
              <label>Date of birth</label>
              <Input
                placeholder="Date of Birth"
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => !e.target.value && (e.target.type = "text")}
                max="2004-12-31"
              />
            </InputGroup>
            <InputGroup display={"flex-col"}>
              <label>Occupation</label>
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon>+61</InputLeftAddon>
              <Input
                type="tel"
                placeholder="phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </InputGroup>
            <InputGroup display={"flex-col"}>
              <label htmlFor="">Gender</label>
              <Select
                placeholder="Select option"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </InputGroup>
            <Button color={"teal"} disabled={isLoading} onClick={submit}>
              Update
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default ProfilePage;
