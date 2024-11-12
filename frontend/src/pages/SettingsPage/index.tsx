import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../api/user";
import { useToast } from "@chakra-ui/react";
import { useUserStore } from "../../store/userStore";

const options = [
  {
    title: "Account",
    description: "View and Update your profile",
    icon: "fa-solid fa-user",
    link: "dashboard/update-password",
  },
  {
    title: "Change Password",
    description: "Change your password",
    icon: "fa-solid fa-lock",
    link: "/dashboard/settings/update-password",
  },
  {
    title: "Deactivate Account",
    description: "You want to take a time off? Deactivate your account",
    icon: "fa-solid fa-circle-xmark",
    link: "dashboard/update-password",
  },
  // {
  //   title: "Logout",
  //   description: "Time to sign out",
  //   icon: "fa-solid fa-power-off",
  //   link: "dashboard/update-password",
  // },
];
const SettingsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { removeLoggedInUser } = useUserStore();

  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeLoggedInUser();
      navigate("/login", { replace: true });
    },
    onError: (error: any) => {
      console.log(error, "from use Mutation error");
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
      // setIsLoading(false);
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        {options.map((el) => (
          <div
            className={styles.messageItem}
            onClick={() => navigate(`${el.link}`)}
          >
            {/* <img src="{msg.avatar}" className={styles.avatar} /> */}
            <i className={`${el.icon}`}></i>

            <div className={styles.messageContent}>
              <div className={styles.header}>
                <h3 className={styles.senderName}>{el.title}</h3>
              </div>
              <div className={styles.messageRow}>
                <p className={styles.messageText}>{el.description}</p>
              </div>
            </div>
          </div>
        ))}
        <div className={styles.messageItem} onClick={() => logoutMutation()}>
          {/* <img src="{msg.avatar}" className={styles.avatar} /> */}
          <i className={`fa-solid fa-power-off`}></i>

          <div className={styles.messageContent}>
            <div className={styles.header}>
              <h3 className={styles.senderName}>Logout</h3>
            </div>
            <div className={styles.messageRow}>
              <p className={styles.messageText}>Time to sign out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
