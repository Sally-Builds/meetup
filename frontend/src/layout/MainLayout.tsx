import { Outlet, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FRIEND_REQUEST_SUBSCRIPTION } from "../gql/subscriptions/request";
import { useSubscription } from "@apollo/client";
import { useUserStore } from "../store/userStore";
import { useAppStore } from "../store/appStore";
import { useQueryClient } from "@tanstack/react-query";
import { MESSAGE_NOTIFICATION_SUBSCRIPTION } from "../gql/subscriptions/message";
import { useEffect } from "react";
import { GET_CHAT } from "../gql/queries/requests";

const MainLayout = () => {
  const { loggedInUser } = useUserStore();
  const { friendId } = useParams();

  const queryClient = useQueryClient();
  const { data, loading, error } = useSubscription(
    FRIEND_REQUEST_SUBSCRIPTION,
    {
      skip: !loggedInUser,
      variables: { user_id: loggedInUser?._id },
      onData: ({ data }) => {
        queryClient.invalidateQueries({
          queryKey: ["requests_count"],
        });
        queryClient.invalidateQueries({
          queryKey: ["requests"],
        });
      },
    }
  );

  const {
    data: msgData,
    loading: msgLoading,
    error: msgErr,
  } = useSubscription(MESSAGE_NOTIFICATION_SUBSCRIPTION, {
    skip: !loggedInUser,
    variables: {
      receiver_id: loggedInUser?._id,
    },
    onData: async ({ data, client }) => {
      console.log("Subscription data received:", data); // log the actual data
      const id_friend = data.data.messageSentNotification.id;

      if (friendId && friendId == id_friend) {
        console.log("in the chat area");
        client.refetchQueries({
          include: [
            {
              query: GET_CHAT,
              variables: { friendId },
            },
          ],
        });
      } else {
        console.log("not in the chat area");
        await queryClient.invalidateQueries({
          queryKey: ["chat"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["msg_unread_count"],
        });
      }
    },
    onError: (error) => {
      console.error("Subscription error:", error); // log any errors
    },
  });

  useEffect(() => {
    if (msgErr) {
      console.error("Message subscription error:", msgErr);
    }
  }, [msgErr]);

  if (!loggedInUser) return <>loading...</>;

  return (
    <>
      <div className="container">
        <Navbar />
        <div className="body">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
