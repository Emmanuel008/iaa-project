import React, { createContext, useReducer } from "react";


const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || {},
};


export const UserContext = createContext();


export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
      };
    case "LOGOUT":
      return { user: {} };
    default:
      return state;
  }
};


export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  React.useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};