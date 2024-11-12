import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IRequest, getRequests, updateRequest } from "../../api/request";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const filterOptions = ["Accepted", "Pending", "Rejected"];
const FriendRequests = () => {
  const [filterValue, setFilterValue] = useState(filterOptions[0]);
  const [filteredData, setFilteredData] = useState<IRequest[]>([]);
  const toast = useToast();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["requests"],
    queryFn: () => getRequests(),
  });

  const { mutateAsync: updateRequestMutation } = useMutation({
    mutationFn: updateRequest,
    onSuccess: (data) => {
      // console.log(data);
      toast({
        title: "Friend Request Updated.",
        description: "Other Users will be able to see your event.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["requests_count"],
      });
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
    },
    onError: (error) => {
      console.log(error, "from use Mutation error");
    },
    onSettled: (_) => {
      // setIsLoading(false);
    },
  });

  useEffect(() => {
    filterFn(filterValue);
  }, [filterValue, data]);

  const filterFn = (value: string) => {
    if (data && data.length > 0) {
      if (value.toLowerCase() == "pending") {
        setFilteredData(data.filter((request) => request.status == "pending"));
      } else if (value.toLowerCase() == "accepted") {
        setFilteredData(data.filter((request) => request.status == "accepted"));
      } else {
        setFilteredData(data.filter((request) => request.status == "rejected"));
      }
    }
  };

  if (isLoading) return <>Loading...</>;

  if (error) return <>Error fetching requests...</>;

  const handleAccept = async (requestId: string) => {
    console.log("Accepted request:", requestId);
    await updateRequestMutation({ requestId, status: "accepted" });
  };

  const handleReject = async (requestId: string) => {
    console.log("Rejected request:", requestId);
    await updateRequestMutation({ requestId, status: "rejected" });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Friend Requests</h2>
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
              <MenuItem key={el} onClick={() => setFilterValue(el)} isFocusable>
                {el}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
      <div className={styles.requestsList}>
        {filteredData.length === 0 ? (
          <p className={styles.noRequests}>
            No {filterValue.toLowerCase()} friend requests
          </p>
        ) : (
          filteredData.map((request) => (
            <div key={request._id} className={styles.requestItem}>
              <div className={styles.userInfo}>
                <img
                  src={request.sender.profile_image.url}
                  alt={`${request.sender.username}'s avatar`}
                  className={styles.avatar}
                />
                <div className={styles.userDetails}>
                  <span className={styles.username}>
                    {request.sender.username}
                  </span>
                  <span className={styles.date}>
                    {/* {formatDate(request.createdAt)} */}
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                {filterValue == "Pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(request._id)}
                      className={`${styles.button} ${styles.acceptButton}`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className={`${styles.button} ${styles.rejectButton}`}
                    >
                      Reject
                    </button>
                  </>
                )}
                {filterValue == "Accepted" && (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/chat/${request.sender._id}`)
                    }
                    className={`${styles.button} ${styles.messageButton}`}
                  >
                    Message
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
