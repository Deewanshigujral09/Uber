// src/context/UserContext.jsx
import { createContext, useState } from "react";

// named export: used with useContext(...)
export const UserDataContext = createContext();

// default export: provider used in main.jsx
const UserDataContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
  });

  // we share [user, setUser] as array
  return (
    <UserDataContext.Provider value={[user, setUser]}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContextProvider;
