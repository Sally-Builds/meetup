import { useQuery } from "@tanstack/react-query";
import { getConnections } from "../../api/request";
import styles from "./index.module.css";
import { useUserStore } from "../../store/userStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IConnection {
  image: string;
  name: string;
  id: string;
}

const ConnectionsPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["connections"],
    queryFn: () => getConnections(),
  });
  const { loggedInUser } = useUserStore();
  const [connections, setConnections] = useState<IConnection[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const connections: IConnection[] = [];
    if (data && loggedInUser) {
      data.connections.forEach((connection) => {
        loggedInUser._id == connection.sender._id
          ? connection.receiver._id
          : connection.sender._id;
        connections.push({
          id:
            loggedInUser._id == connection.sender._id
              ? connection.receiver._id
              : connection.sender._id,
          name:
            loggedInUser._id == connection.sender._id
              ? connection.receiver.full_name
              : connection.sender.full_name,
          image:
            loggedInUser._id == connection.sender._id
              ? connection.receiver.profile_image.url
              : connection.sender.profile_image.url,
        });
      });
      setConnections(connections);
    }
  }, [data, loggedInUser]);

  if (isLoading) return <>loading...</>;
  if (error) return <>error fetching data...</>;

  console.log(data);

  return (
    <div className={styles.requestsList}>
      {connections.map((connection) => (
        <div key={connection.id} className={styles.requestItem}>
          <div className={styles.userInfo}>
            <img src={connection.image} className={styles.avatar} />
            <div className={styles.userDetails}>
              <span className={styles.username}>{connection.name}</span>
              <span className={styles.date}>
                {/* {formatDate(request.createdAt)} */}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => navigate(`/dashboard/chat/${connection.id}`)}
              className={`${styles.button} ${styles.messageButton}`}
            >
              Message
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConnectionsPage;
