import { Button, Grid, GridItem, Text } from "@chakra-ui/react";
import styles from "./index.module.css";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IEvent, getEvents } from "../../api/event";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEventStore } from "../../store/eventStore";
import { useUserStore } from "../../store/userStore";

const filterOptions = ["All", "Past", "Upcoming", "My Events", "Attending"];
const EventsPage = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(filterOptions[0]);
  const [filteredData, setFilteredData] = useState<IEvent[]>([]);
  const { setEvents } = useEventStore();

  const { loggedInUser } = useUserStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });

  useEffect(() => {
    filterFn(filterValue);
    if (data) {
      setEvents(data.events);
    }
  }, [filterValue, data]);

  isLoading && <>Loading</>;

  error && <>error loading page</>;

  const filterFn = (value: string) => {
    if (data && data.events.length > 0) {
      if (value == filterOptions[0]) {
        setFilteredData(data.events);
      }
      if (value == filterOptions[1]) {
        setFilteredData(
          data.events.filter((event) => hasEventPassed(event.date))
        );
      }
      if (value == filterOptions[2]) {
        setFilteredData(
          data.events.filter((event) => !hasEventPassed(event.date))
        );
      }
      if (value == filterOptions[3]) {
        setFilteredData(
          data.events.filter((event) => event.user == loggedInUser?._id)
        );
      } else {
        return data.events;
      }
    }
  };

  const hasEventPassed = (date: Date) => {
    // The given time
    // Get the next day from now
    const nextDay = moment().add(1, "days").startOf("day");

    // Check if the given time is before the next day
    const isPast = moment(date).isBefore(nextDay);

    return isPast;
  };

  return (
    <>
      {data && (
        <div className="container">
          <div className={styles["heading"]}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<i className="fa-solid fa-sort"></i>}
              >
                {filterValue}
              </MenuButton>
              <MenuList>
                {filterOptions.map((el) => (
                  <MenuItem
                    key={el}
                    onClick={() => setFilterValue(el)}
                    isFocusable
                  >
                    {el}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <div className={styles["title"]}>
              <button onClick={() => navigate("create")}>
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
          </div>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={0.5}
            className={styles["grid"]}
          >
            {filteredData.map((el) => (
              <GridItem
                key={el.slug}
                w="100%"
                h="200"
                bg="#6c6c6c"
                onClick={() => navigate(el.slug)}
              >
                <img
                  src={el.cover_image.url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </GridItem>
            ))}
          </Grid>
        </div>
      )}
    </>
  );
};

export default EventsPage;
