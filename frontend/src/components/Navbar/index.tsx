import styles from "./index.module.css";
import { useNavigate } from "react-router-dom";
import { getPendingCount, getRequests } from "../../api/request";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../api/chat";

const Navbar = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["requests_count"],
    queryFn: () => getPendingCount(),
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["msg_unread_count"],
    queryFn: () => getUnreadCount(),
  });

  if (isLoading) return <>...loading</>;

  if (error) return <>error</>;

  if (data) {
    console.log(data, "count");
  }
  return (
    <>
      <div className={styles["container"]}>
        <nav className={styles["nav"]}>
          <div>
            <button onClick={() => navigate(-1)}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>

          <ul>
            <li>
              <button type="button" className={styles["icon-button"]}>
                <i className="fa-solid fa-sliders"></i>
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
                onClick={() => navigate("/dashboard/messages")}
              >
                <i className="fa-regular fa-comments"></i>
                {unreadCount && unreadCount > 0 && (
                  <span className="icon-button__badge">{unreadCount}</span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
