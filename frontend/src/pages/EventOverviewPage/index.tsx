import { useParams } from "react-router-dom";
import { useEventStore } from "../../store/eventStore";
import { useEffect, useState } from "react";
import { IEvent, fetchEvent } from "../../api/event";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@chakra-ui/react";
import moment from "moment";
import styles from "./index.module.css";

const EventOverviewPage = () => {
  const { slug } = useParams();
  const { getEvent } = useEventStore();
  const [event, setEvent] = useState<IEvent | null>(null);

  // Check event in store
  const eventInStore = getEvent(slug || "");

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent(slug || ""),
    enabled: !eventInStore,
  });

  useEffect(() => {
    if (eventInStore) {
      setEvent(eventInStore);
    }
  }, [eventInStore]);

  useEffect(() => {
    if (data) {
      setEvent(data);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading event</div>;
  return (
    <>
      {event && (
        <div className={styles["container"]}>
          <div className="img">
            <img src={event.cover_image.url} alt="event cover" />
          </div>

          <div className={styles["title"]}>{event.name}</div>

          <div className={styles["header"]}>
            <div className="time">
              {moment(event.date).format("MMMM Do YYYY, h:mm A")}
            </div>

            <div className="attending">
              <i className="fa-solid fa-user-check"></i> 9
            </div>
          </div>

          <div className={styles["sub-header"]}>
            <div className="attendees">
              <i className="fa-solid fa-users"></i> {event.expected_attendees}
              {/* &nbsp; expected Guests */}
            </div>
            <div className="location">
              <i
                className="fa-solid fa-location-dot"
                style={{ color: "red" }}
              ></i>{" "}
              {event.location}
            </div>
          </div>

          <div>
            <div className={styles["title"]}>Activities includes</div>
            <div className={styles["activities"]}>
              {event.activities.map((value: string) => (
                <span key={value}>
                  <Badge colorScheme="purple">{value}</Badge>
                </span>
              ))}
            </div>
          </div>
          <div className="description">{event.description}</div>
        </div>
      )}
    </>
  );
};

export default EventOverviewPage;
