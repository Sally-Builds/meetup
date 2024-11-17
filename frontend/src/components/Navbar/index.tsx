import styles from "./index.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getPendingCount, getRequests } from "../../api/request";
import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../api/chat";
import { useEffect, useState } from "react";

enum AllLoggedInRoutes {
  DASHBOARD = "/dashboard",
  MEETUP_DUO = "/dashboard/duo-meetup",
  MEETUP_MULTI = "/dashboard/events",
  EVENT_OVERVIEW = "/dashboard/events/",
  CREATE_EVENT = "/dashboard/events/create",
  MESSAGES = "/dashboard/messages",
  CONNECTIONS = "/dashboard/connections",
  REQUESTS = "/dashboard/requests",
  PROFILE = "/dashboard/settings/profile",
  UPDATE_INTERESTS = "/dashboard/settings/update-interests",
  UPDATE_PASSWORD = "/dashboard/settings/update-password",
  SETTINGS = "/dashboard/settings",
}

const Navbar = () => {
  const navigate = useNavigate();
  const [msgCount, setMsgCount] = useState(0);
  const location = useLocation();

  const { data, isLoading, error } = useQuery({
    queryKey: ["requests_count"],
    queryFn: () => getPendingCount(),
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["msg_unread_count"],
    queryFn: () => getUnreadCount(),
    staleTime: 0, // Data is considered stale immediately
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (unreadCount) {
      setMsgCount(unreadCount);
    }
  }, [unreadCount]);

  if (isLoading) return <>...loading</>;

  if (error) return <>error</>;

  const goBack = () => {
    console.log(location.pathname);
    switch (location.pathname) {
      case AllLoggedInRoutes.MEETUP_DUO:
      case AllLoggedInRoutes.MESSAGES:
      case AllLoggedInRoutes.CONNECTIONS:
      case AllLoggedInRoutes.MEETUP_MULTI:
      case AllLoggedInRoutes.SETTINGS:
        navigate(AllLoggedInRoutes.DASHBOARD);
        break;
      case AllLoggedInRoutes.CREATE_EVENT:
        navigate(AllLoggedInRoutes.MEETUP_MULTI);
        break;
      case AllLoggedInRoutes.PROFILE:
      case AllLoggedInRoutes.UPDATE_INTERESTS:
      case AllLoggedInRoutes.UPDATE_PASSWORD:
        navigate(AllLoggedInRoutes.SETTINGS);
        break;
    }
    const chatExp = /^\/dashboard\/chat\/.*/;
    if (chatExp.test(location.pathname)) {
      navigate(AllLoggedInRoutes.MESSAGES);
    }
    const eventExp = /^\/dashboard\/events\/.*/;
    if (eventExp.test(location.pathname)) {
      navigate(AllLoggedInRoutes.MEETUP_MULTI);
    }
    console.log(location.pathname, "here is my location");
  };

  return (
    <>
      <div className={styles["container"]}>
        <nav className={styles["nav"]}>
          <div className={styles.navQuick}>
            <button onClick={goBack}>
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
