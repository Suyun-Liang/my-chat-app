import { createContext, useCallback, useContext, useState } from "react";

import { postRequst } from "../services/service";
import { BASE_URL } from "../utils/constant";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(null, "User");

  // register state
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  //login state
  const [loginError, setLoginError] = useState(null);
  const [isloginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  // register user
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async () => {
    try {
      setIsRegisterLoading(true);
      setRegisterError(null);
      const res = await postRequst(`${BASE_URL}/users/register`, registerInfo);

      if (res?.error) return setRegisterError(res);

      setUser(res);
    } catch (error) {
      console.error(error);
      setRegisterError(error);
    } finally {
      setIsRegisterLoading(false);
    }
  }, [registerInfo, setUser]);

  // login user
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const loginUser = useCallback(async () => {
    try {
      setIsLoginLoading(true);
      setLoginError(null);
      const res = await postRequst(`${BASE_URL}/users/login`, loginInfo);

      if (res?.error) return setLoginError(res);

      setUser(res);
    } catch (error) {
      console.error(error);
      setLoginError(error);
    } finally {
      setIsLoginLoading(false);
    }
  }, [loginInfo, setUser]);

  //logout user
  const logoutUser = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,

        loginInfo,
        updateLoginInfo,
        loginUser,
        loginError,
        isloginLoading,

        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const value = useContext(AuthContext);

  if (value === undefined)
    throw new Error("AuthContext was used outside of AuthProvider");

  return value;
}

export { AuthProvider, useAuth };
