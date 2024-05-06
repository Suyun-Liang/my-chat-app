import { Container, Nav, Navbar as ReactNavbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import Notification from "./chat/Notification";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const { socket, setAllStateDefault } = useChat();

  return (
    <ReactNavbar bg="dark" className="mb-4" style={{ height: "60px" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        {user && <span className="text-warning">Logged in as {user.name}</span>}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user ? (
              <>
                <Notification />
                <Link
                  onClick={() => {
                    socket.disconnect();
                    setAllStateDefault();
                    logoutUser();
                  }}
                  to="/login"
                  className="link-light text-decoration-none"
                >
                  Log out
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="link-light text-decoration-none">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </ReactNavbar>
  );
}

export default Navbar;
