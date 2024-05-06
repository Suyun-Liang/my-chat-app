import { Stack } from "react-bootstrap";
import truncate from "lodash/truncate";

import Avatar from "../../assets/avatar.svg";
import { useAuth } from "../../context/AuthContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser";
import { useChat } from "../../context/ChatContext";
import { getUnreadNotifications } from "../../utils/Helper";
import { useLatestMessage } from "../../hooks/useLatestMessage";
import moment from "moment";

function UserChat({ chat }) {
  const { user } = useAuth();
  const { recipient, error: recipientError } = useFetchRecipientUser(
    chat,
    user
  );
  const {
    updateCurrentChat,
    onlineUsers,
    notifications,
    markThisUserNotificationAsRead,
  } = useChat();

  const { latestMesssage } = useLatestMessage(chat);

  const isOnline = onlineUsers?.some((cur) => cur.userId === recipient?._id);
  const unreadNotifications = getUnreadNotifications(notifications).filter(
    (n) => n.senderId === recipient?._id
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center justify-content-between p-2"
      role="button"
      onClick={() => {
        updateCurrentChat(chat);
        if (unreadNotifications.length > 0) {
          markThisUserNotificationAsRead(recipient?._id);
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          <img
            src={Avatar}
            height="35px"
            alt={`avatar of ${recipient?.name}`}
          />
        </div>
        <div className="text-content">
          <div className="name">{recipient?.name}</div>
          <div className="text">
            {latestMesssage?.text && (
              <span>{truncate(latestMesssage.text, { length: 20 })}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        {isOnline && <span className="user-online"></span>}
        <div className="date">
          {moment(latestMesssage?.createdAt).calendar()}
        </div>
        {unreadNotifications.length > 0 && (
          <div className="this-user-notifications">
            {unreadNotifications.length}
          </div>
        )}
      </div>
    </Stack>
  );
}

export default UserChat;
