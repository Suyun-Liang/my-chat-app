import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

function PotentialChats() {
  const { user: client } = useAuth();
  const { potentialChats, createChat, onlineUsers, userChats } = useChat();
  return (
    <div>
      <div className="all-users">
        {potentialChats?.map((user) => {
          return (
            <div
              className="single-user"
              key={user._id}
              onClick={() => {
                const isExistChat = userChats.find((chat) => {
                  const chatMember = [user._id, client.id];
                  return chat.members.every((m) => chatMember.includes(m));
                });
                if (!isExistChat) {
                  createChat({ firstId: user._id, secondId: client._id });
                }
              }}
            >
              {user.name}
              {onlineUsers?.some((cur) => cur.userId === user._id) && (
                <span className="user-online"></span>
              )}
            </div>
          );
        })}
        <div className="single-group">CoffeeHead</div>
      </div>
    </div>
  );
}

export default PotentialChats;
