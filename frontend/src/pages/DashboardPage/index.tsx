import { useNavigate } from "react-router-dom";
import Hero from "../../components/Hero";
import styles from "./index.module.css";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/user";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  useEffect(() => {
    console.log("entered");
  }, []);

  console.log(data);
  return (
    <>
      {isLoading && <p> Please wait... </p>}
      {data && (
        <>
          <Hero img={data.profile_image.url} />
          <div className={styles["container"]}>
            <div className={styles["heading"]}>
              <div className="title">Welcome back, {data.full_name} </div>
              <span className="description">
                You can choose between Duo meetup to connect with individual of
                similar interest, or hangout with meetup multi to join a group
                event or even host a group event
              </span>
            </div>
            <button className={styles["btn"]}>Duo Meetup</button>
            <button
              className={styles["btn"]}
              onClick={() => navigate("events")}
            >
              Multi Meetup
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
