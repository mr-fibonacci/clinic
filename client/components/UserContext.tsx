import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const CurrentUserContext = createContext(null);
export const useCurrentUser = () => {
  return useContext(CurrentUserContext);
};

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const handleCurrentUser = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/users/currentuser",
        {
          withCredentials: true,
        }
      );
      console.log("user data", data);
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleCurrentUser();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
};
