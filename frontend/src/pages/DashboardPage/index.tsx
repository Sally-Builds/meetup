import { useNavigate } from "react-router-dom";
import Hero from "../../components/Hero";
import styles from "./index.module.css";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/user";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  useEffect(() => {
    if (data && !isLoading && !error) {
      // Ensure profile_image exists and is not null pushed
      if (!data.profile_image || !data.profile_image.url) {
        navigate("/getting-started");
      }
    }
  }, [data, isLoading, error, navigate]);

  console.log(data);

  return (
    <>
      {isLoading && <p> Please wait... </p>}
      {data && (
        <>
          <Hero img={data.profile_image?.url} />
          <div className={styles["container"]}>
            <div className={styles["heading"]}>
              <div className="title">Welcome back, {data.full_name} </div>
              <span className="description">
                You can choose between Duo meetup to connect with individuals of
                similar interest, or hangout with Meetup Multi to join or host a
                group event.
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
