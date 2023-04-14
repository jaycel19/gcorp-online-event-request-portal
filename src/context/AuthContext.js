import { createContext, useContext, useState, } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);

    return(
        <AuthContext.Provider value={{ isLogged, setIsLogged }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);