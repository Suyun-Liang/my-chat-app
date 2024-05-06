import { Container, Stack } from "react-bootstrap";

import ChatBox from "../components/chat/ChatBox";
import PotentialChats from "../components/chat/PotentialChats";
import UserChat from "../components/chat/UserChat";

import { useChat } from "../context/ChatContext";

function Chat() {
  const { userChats, userChatsError, isUserChatsLoading } = useChat();
  return (
    <Container>
      <PotentialChats />
      {userChats?.length > 0 && (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatsLoading && <p>Loading Chats...</p>}
            {userChats?.map((chat) => (
              <UserChat chat={chat} key={chat._id} />
            ))}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
}

export default Chat;
