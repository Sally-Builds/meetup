import { useParams } from "react-router-dom";
import { useEventStore } from "../../store/eventStore";
import { useEffect, useState } from "react";
import {
  IEvent,
  fetchEvent,
  getIsAttending,
  getMarkedAttendanceCount,
  markAttendance,
} from "../../api/event";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Button, useToast } from "@chakra-ui/react";
import moment from "moment";
import styles from "./index.module.css";

const EventOverviewPage = () => {
  const { slug } = useParams();
  const { getEvent } = useEventStore();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [isAttending, setIsAttending] = useState(true);
  const [attendingGuestCount, setAttendingGuestsCount] = useState(0);
  const [markAttendanceLoading, setMarkAttendanceLoading] = useState(false);
  const toast = useToast();

  // Check event in store
  const eventInStore = getEvent(slug || "");

  const {
    data,
    isLoading,
    error,
    refetch: refetchEvent,
  } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEvent(slug || ""),
    enabled: !eventInStore,
  });

  const {
    isLoading: isAttendingLoading,
    error: isAttendingErr,
    refetch: checkAttendance,
  } = useQuery({
    queryKey: ["is-attending", slug],
    queryFn: () => getIsAttending(event?._id || ""),
  });

  const {
    isLoading: markedAttendanceCountLoading,
    error: markedAttendanceCountErr,
    refetch: markedAttendanceCount,
  } = useQuery({
    queryKey: ["marked-attendance-count", slug],
    queryFn: () => getMarkedAttendanceCount(event?._id || ""),
  });

  useEffect(() => {
    if (eventInStore) {
      setEvent(eventInStore);
      getMyAttendance();
      getEventsMarkedAttendance();
    }
  }, [eventInStore]);

  useEffect(() => {
    if (data) {
      setEvent(data);
      getMyAttendance();
      getEventsMarkedAttendance();
    }
  }, [data]);

  if (isLoading && isAttendingLoading && markedAttendanceCountLoading)
    return <div>Loading...</div>;
  if (error && isAttendingErr && markedAttendanceCountErr)
    return <div>Error loading event</div>;

  const getMyAttendance = async () => {
    let attendance = await checkAttendance();
    setIsAttending(!!attendance.data);
  };

  const getEventsMarkedAttendance = async () => {
    let attendingGuests = await markedAttendanceCount();
    setAttendingGuestsCount(attendingGuests.data || 0);
    console.log(attendingGuests, "num of guests");
  };

  const submitAttendance = async () => {
    setMarkAttendanceLoading(true);
    if (!event) return;
    try {
      await markAttendance(event._id);
      await refetchEvent();
      await markedAttendanceCount();
      toast({
        title: "Successful",
        description: "Attendance Registered Successfully",
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
      setMarkAttendanceLoading(false);
    }
  };

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
              <i className="fa-solid fa-user-check"></i> {attendingGuestCount}
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
          {!isAttending && (
            <div>
              <Button
                onClick={submitAttendance}
                disabled={markAttendanceLoading}
              >
                Attending
              </Button>
            </div>
          )}
          {isAttending && <div>You have marked attendance for this event</div>}
        </div>
      )}
    </>
  );
};

export default EventOverviewPage;
