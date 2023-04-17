import { createContext, useContext, useState, } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    return(
        <AuthContext.Provider value={{ isLogged, setIsLogged, setLoggedIn, loggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);