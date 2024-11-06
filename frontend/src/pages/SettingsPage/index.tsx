import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

const options = [
  {
    title: "Account",
    description: "View and Update your profile",
    icon: "fa-solid fa-user",
  },
  {
    title: "Change Password",
    description: "Change your password",
    icon: "fa-solid fa-lock",
  },
  {
    title: "Deactivate Account",
    description: "You want to take a time off? Deactivate your account",
    icon: "fa-solid fa-circle-xmark",
  },
  {
    title: "Logout",
    description: "Time to sign out",
    icon: "fa-solid fa-power-off",
  },
];
const SettingsPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        {options.map((el) => (
          <div
            className={styles.messageItem}
            onClick={() => navigate(`/dashboard`)}
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
      </div>
    </div>
  );
};

export default SettingsPage;
