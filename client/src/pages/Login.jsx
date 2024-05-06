import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { loginInfo, updateLoginInfo, loginUser, isLoginLoading, loginError } =
    useAuth();
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        loginUser();
      }}
    >
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
          paddingTop: "10%",
        }}
      >
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Log in</h2>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, email: e.target.value })
              }
            />
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, password: e.target.value })
              }
            />
            <Button variant="primary" type="submit">
              {isLoginLoading ? "Logging in..." : "Log in "}
            </Button>

            {loginError?.error && (
              <Alert variant="danger">
                <p>{loginError.message}</p>
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
}

export default Login;
