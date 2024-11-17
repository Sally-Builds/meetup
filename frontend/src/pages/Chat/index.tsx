import { useEffect, useState, useRef } from "react";
import styles from "./index.module.css";
import { Send } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHAT } from "../../gql/queries/requests";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { SEND_CHAT } from "../../gql/mutations/chat";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";

interface ProfileImage {
  url: string;
  publicId: string;
}

interface Participant {
  _id: string;
  username: string;
  full_name: string;
  profile_image: ProfileImage;
}

interface Message {
  _id: string;
  senderId: string;
  content: string;
  status: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  participants: Participant[];
}

// Define the shape of the query response
interface GetChatResponse {
  getChat: Chat;
}

interface ISerializedChat {
  message: string;
  image: string;
  status: string;
  username: string;
  isMine: boolean;
  time: string;
}

const Chat = () => {
  const { friendId } = useParams();
  const { loggedInUser } = useUserStore();
  const queryClient = useQueryClient();

  // Guard clauses at the top
  if (!friendId) return <>...user not found</>;
  if (!loggedInUser) return <>...Unauthorized</>;

  const [message, setMessage] = useState("");
  const [serializedChat, setSerializedChat] = useState<ISerializedChat[]>([]);
  const messagesEndRef = useRef(null);

  const { loading, error, data } = useQuery<GetChatResponse>(GET_CHAT, {
    skip: !friendId || !loggedInUser,
    variables: { friendId },
    fetchPolicy: "network-only",
  });

  const [sendMessage, { loading: sendLoading, error: sendError }] = useMutation(
    SEND_CHAT,
    {
      onCompleted(data, clientOptions) {
        console.log(
          data,
          "---------------------------------------------------"
        );
      },
      onError: (error) => {
        console.error("Message send error:", error);
      },
      // Optionally refetch the chat after sending
      refetchQueries: [
        {
          query: GET_CHAT,
          variables: { friendId },
        },
      ],
    }
  );

  useEffect(() => {
    if (data && loggedInUser) {
      console.log(
        data,
        "---------------------------------------------------ds"
      );
      const chat = data.getChat;
      if (chat) {
        const serializedChat: ISerializedChat[] = chat.messages.map((el) => {
          const sender = chat.participants.find(
            (par) => par._id === el.senderId
          );
          return {
            message: el.content,
            status: el.status,
            username: sender?.username ?? "",
            image: sender?.profile_image.url ?? "",
            isMine: sender?._id === loggedInUser._id,
            time: el.timestamp,
          };
        });
        setSerializedChat(serializedChat);
      }
    }

    if (serializedChat.length == 0) {
      queryClient.invalidateQueries({
        queryKey: ["msg_unread_count"],
      });
    }
  }, [data, loggedInUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [serializedChat]);

  if (loading) return <p>Loading...</p>;
  if (error || sendError)
    return <p>Error: {error?.message || sendError?.message}</p>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (message.trim()) {
        console.log("Sending message to:", friendId);
        await sendMessage({
          variables: {
            to: friendId,
            from: loggedInUser?._id,
            content: message.trim(),
          },
        });
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {serializedChat.map((chat, i) => (
          <React.Fragment key={i}>
            {chat.isMine ? (
              <div className={`${styles.message} ${styles.sender}`}>
                <div className={styles.avatar} />
                <div className={styles.messageContent}>
                  <div className={styles.name}>You</div>
                  <div className={styles.bubble}>{chat.message}</div>
                  <div className={styles.time}>
                    {moment(chat.time).format("hh:mm A")}
                  </div>
                  <div className={styles.status}>
                    <div className={styles.statusDot} />
                    {chat.status === "read" ? "Seen" : "Delivered"}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${styles.message} ${styles.recipient}`}>
                <div className={styles.avatar} />
                <div className={styles.messageContent}>
                  <div className={styles.name}>{chat.username}</div>
                  <div className={styles.bubble}>{chat.message}</div>
                  <div className={styles.time}>
                    {moment(chat.time).format("hh:mm A")}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!message.trim() || sendLoading}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
