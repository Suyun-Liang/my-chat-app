import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import { getRequest, postRequst } from "../services/service";
import { BASE_URL } from "../utils/constant";

const ChatContext = createContext();

function ChatProvider({ children, user }) {
  // user chats state
  const [userChats, setUserChats] = useState(null);
  const [userChatsError, setUserChatsError] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [potentialChats, setPotentialChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  // get messages state
  const [messages, setMessages] = useState(null);
  const [messagesError, setMessagesError] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  // send messages state
  const [newMessage, setNewMessage] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  // soket state
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  //initialize socket io
  useEffect(() => {
    if (!user?._id) return;
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  // add online users
  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("socekt connected");
      socket.emit("addNewUser", user?._id, user?.name);
      socket.on("getOnlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });
    });

    // remove event listener
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, user?._id, user?.name]);

  // receive message from a user
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (data) => {
      if (data?.chatId !== currentChat?._id) return;
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChat?._id]);

  // receive notification from a user
  useEffect(() => {
    if (!socket) return;

    socket.on("getNotification", (data) => {
      // at recepient side, if the chat contains sender, then the chat is open
      const isChatOpen = currentChat?.members.includes(data.senderId);
      if (isChatOpen) {
        setNotifications((prev) => [...prev, { ...data, isRead: true }]);
      } else {
        setNotifications((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("getNotification");
    };
  }, [socket, currentChat?.members]);

  // get user's chats list
  useEffect(() => {
    const getUserChats = async () => {
      try {
        if (!user?._id) return;

        setUserChatsError(null);
        setIsUserChatsLoading(true);

        const res = await getRequest(`${BASE_URL}/chats/${user?._id}`);

        // if we have an error
        if (res?.error) return setUserChatsError(res);

        setUserChats(res);
      } catch (error) {
        console.error(error);
        setUserChatsError(error);
      } finally {
        setIsUserChatsLoading(false);
      }
    };
    getUserChats();
  }, [user?._id, notifications]);

  // get potiential chat recipients(users who havent't start chat with logged-in user)
  useEffect(() => {
    const getPotientialRecipients = async () => {
      try {
        if (!user?._id) return;
        const resAllUsers = await getRequest(`${BASE_URL}/users`);
        const potentialUsers = resAllUsers?.filter((curUser) => {
          // exclude user themself
          if (curUser._id === user._id) return false;

          // exclude recipients who already chatting with user
          let isExistRecipient = false;
          if (userChats) {
            isExistRecipient = userChats.some((chat) => {
              return chat.members?.includes(curUser._id);
            });
          }

          return !isExistRecipient;
        });
        setPotentialChats(potentialUsers);
        setAllUsers(resAllUsers);
      } catch (error) {
        console.error(error);
      }
    };

    getPotientialRecipients();
  }, [user?._id, userChats, notifications]);

  // find a chat
  const getChat = async (firstId, secondId) => {
    try {
      const res = await getRequest(
        `${BASE_URL}/chats/find/${firstId}/${secondId}`
      );

      if (res?.error) throw new Error(res.message);

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  // create a chat when click on any potential recipient
  const createChat = async ({ firstId, secondId }) => {
    try {
      let res;

      res = await getChat(firstId, secondId);

      if (!res) {
        res = await postRequst(`${BASE_URL}/chats`, { firstId, secondId });
      }

      if (res.error) throw new Error("Error creating chat");

      setUserChats((prevChats) => [...prevChats, res]);

      return res;
    } catch (error) {
      console.error(error);
    }
  };

  // update current chat when click userChat
  const updateCurrentChat = (chat) => {
    setCurrentChat(chat);
  };

  // get all messages when there is curentChat
  useEffect(() => {
    const getMessages = async () => {
      try {
        setMessagesError(null);
        setIsMessagesLoading(true);
        const res = await getRequest(
          `${BASE_URL}/messages/${currentChat?._id}`
        );

        if (res?.error) return setMessagesError(res);

        setMessages(res);
      } catch (error) {
        console.error(error);
        setMessagesError(error);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    getMessages();
  }, [currentChat?._id]);

  // send a message when click on send button in chat box
  const sendTextMessage = async ({
    text,
    senderId,
    chatId,
    setTextMessage,
  }) => {
    try {
      if (!text) throw new Error("you must type sth...");

      const res = await postRequst(`${BASE_URL}/messages`, {
        text,
        senderId,
        chatId,
      });

      if (res?.error) setSendTextMessageError(res);

      setNewMessage(res);
      setMessages((prev) => [...prev, res]);
      setTextMessage("");

      // send message to websocket api
      if (socket) {
        const recipientId = currentChat?.members.find((id) => id !== senderId);
        socket.emit("sendMessage", { newMessage: res, recipientId });
      }
    } catch (error) {
      console.error(error);
      setSendTextMessageError(error);
    }
  };

  // mark all notification as read
  const markAllNotificationsAsRead = () => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  };

  // mark a notification as read, for notification box content
  const markNotificationAsRead = async (senderId) => {
    // find the chat to open, find the chatID
    let desiredChat = userChats.find((chat) => {
      const chatMember = [user?._id, senderId];
      const isDesired = chat.members.every((m) => chatMember.includes(m));
      return isDesired;
    });

    // if cannot find desiredChat, then find from database, and update the state userChats
    if (!desiredChat) {
      desiredChat = await createChat({
        firstId: user?._id,
        secondId: senderId,
      });
    }

    updateCurrentChat(desiredChat);

    // update the notification as read
    const mNotifications = notifications.map((n) => {
      if (n.senderId === senderId) {
        return { ...n, isRead: true };
      } else {
        return n;
      }
    });
    setNotifications(mNotifications);
  };

  // mark a notification as read, for click event on recipient avatar(userChat)
  const markThisUserNotificationAsRead = (senderId) => {
    // update the notification as read
    const mNotifications = notifications.map((n) => {
      if (n.senderId === senderId) {
        return { ...n, isRead: true };
      } else {
        return n;
      }
    });
    setNotifications(mNotifications);
  };

  const setAllStateDefault = () => {
    // user chats state
    setUserChats(null);
    setUserChatsError(null);
    setIsUserChatsLoading(false);
    setPotentialChats([]);
    setAllUsers([]);
    setCurrentChat(null);
    // get messages state
    setMessages(null);
    setMessagesError(null);
    setIsMessagesLoading(false);
    // send messages state
    setNewMessage(null);
    setSendTextMessageError(null);
    // soket state
    setSocket(null);
    setOnlineUsers([]);
    setNotifications([]);
  };

  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        allUsers,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        newMessage,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        socket,
        notifications,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
        getChat,
        setAllStateDefault,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

function useChat() {
  const value = useContext(ChatContext);

  if (value === undefined)
    throw new Error("ChatContext was used outside of ContextProvider");

  return value;
}

export { ChatProvider, useChat };
