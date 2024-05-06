import { useEffect, useState } from "react";
import { getRequest } from "../services/service";
import { BASE_URL } from "../utils/constant";
import { useChat } from "../context/ChatContext";

export function useLatestMessage(chat) {
  const [latestMesssage, setLatestMessage] = useState(null);
  const { newMessage, notifications } = useChat();
  useEffect(() => {
    const getMessages = async () => {
      try {
        if (newMessage || notifications) {
          const res = await getRequest(`${BASE_URL}/messages/${chat?._id}`);

          if (res?.error) return console.log("something wrong", res?.error);

          setLatestMessage(res.at(-1));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMessages();
  }, [chat?._id, newMessage, notifications]);

  return { latestMesssage };
}
