import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { getPendingCount, getRequests } from "../../api/request";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../api/chat";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [msgCount, setMsgCount] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["requests_count"],
    queryFn: () => getPendingCount(),
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["msg_unread_count"],
    queryFn: () => getUnreadCount(),
  });

  useEffect(() => {
    if (unreadCount) {
      setMsgCount(unreadCount);
    }
  }, [unreadCount]);

  if (isLoading) return <>...loading</>;

  if (error) return <>error</>;

  if (data) {
    console.log(data, "count");
  }
  return (
    <>
      <div className={styles["container"]}>
        <nav className={styles["nav"]}>
          <div className={styles.navQuick}>
            <button onClick={() => navigate(-1)}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              className={styles["icon-button"]}
              onClick={() => navigate("/dashboard")}
            >
              <i className="fa-solid fa-house"></i>
            </button>
          </div>

          <ul>
            <li>
              <button
                type="button"
                className={styles["icon-button"]}
                onClick={() => navigate("/dashboard/messages")}
              >
                <i className="fa-regular fa-comments"></i>
                {msgCount > 0 && (
                  <span className="icon-button__badge">{msgCount}</span>
                )}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles["icon-button"]}
                onClick={() => navigate("/dashboard/connections")}
              >
                <i className="fa-solid fa-people-arrows"></i>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles["icon-button"]}
                onClick={() => navigate("/dashboard/requests")}
              >
                <i className="fa-regular fa-bell"></i>
                {data && data.count > 0 && (
                  <span className="icon-button__badge"> {data.count} </span>
                )}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={styles["icon-button"]}
                onClick={() => navigate("/dashboard/settings")}
              >
                <i className="fa-solid fa-sliders"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
