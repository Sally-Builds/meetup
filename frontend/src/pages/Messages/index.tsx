import { useQuery } from "@tanstack/react-query";
import styles from "./index.module.css";
import { IChat, getAllChat } from "../../api/chat";
import { useUserStore } from "../../store/userStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  unreadCount: number;
  timestamp: string;
  participants: string[];
}

const MessageList = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { loggedInUser } = useUserStore();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chat"],
    queryFn: () => getAllChat(),
  });

  useEffect(() => {
    console.log(data, "messages");
    if (data && loggedInUser) {
      let messages: IMessage[] = data.map((chat: IChat) => {
        let sender = chat.participants.find(
          (participant) => participant._id != loggedInUser._id
        );
        return {
          id: chat._id,
          sender: sender?.username ?? "",
          avatar: sender?.profile_image.url ?? "",
          message: chat.messages[chat.messages.length - 1].content,
          unreadCount: chat.unreadMessageCount,
          timestamp: chat.messages[chat.messages.length - 1].timestamp,
          participants: chat.participants?.map((data) => data._id),
        };
      });

      setMessages(messages);
    }
  }, [data, loggedInUser]);

  if (isLoading) return <>...loading</>;

  if (error) return <>error</>;

  const getFriendId = (participants: string[]) => {
    return participants.find((friendId) => friendId != loggedInUser?._id) ?? "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={styles.messageItem}
            onClick={() =>
              navigate(`/dashboard/chat/${getFriendId(msg.participants)}`)
            }
          >
            <img
              src={msg.avatar}
              alt={`${msg.sender}'s avatar`}
              className={styles.avatar}
            />

            <div className={styles.messageContent}>
              <div className={styles.header}>
                <h3 className={styles.senderName}>{msg.sender}</h3>
                <div className={styles["timestamp"]}>5:33PM</div>
              </div>
              <div className={styles.messageRow}>
                <p className={styles.messageText}>{msg.message}</p>
                {msg.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>{msg.unreadCount}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;
