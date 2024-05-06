import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import Navbar from "./Navbar";
import { ChatProvider } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

function AppLayout() {
  const { user } = useAuth();
  return (
    <ChatProvider user={user}>
      <div>
        <Navbar />
        <Container>
          <Outlet />
        </Container>
      </div>
    </ChatProvider>
  );
}

export default AppLayout;
