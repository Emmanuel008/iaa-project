import { useState } from "react";
import { useUserContext } from "./useUserContext";
import axios from "axios";
import {url} from "../Utills/API"

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch: authDispatch } = useUserContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    axios.defaults.withCredentials = true
    try {
      await axios
        .post(`${url}/user/login`, {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem(
            "user",
            JSON.stringify({
              user: res.data.user,
            })
          );
          authDispatch({
            type: "LOGIN",
            payload: res.data.user ,
          });
          setIsLoading(false);
          window.location = "/main";
        });
    } catch (error) {
      setIsLoading(false);
      error.response.data && setError(error.response.data);
    }
  };
  return { login, isLoading, error, setError };
};
