import { createContext, useContext, useState, } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState({
        login: false
    });
    const [loggedIn, setLoggedIn] = useState({
        login: false
    });

    const [isAdminLogged, setIsAdminLogged] = useState({
        login: false
    });
    const [adminLoggedIn, setAdminLoggedIn] = useState({
        login: false
    });

    return(
        <AuthContext.Provider value={{ 
            isLogged,
            loggedIn,
            setIsLogged, 
            setLoggedIn, 
            isAdminLogged, 
            adminLoggedIn, 
            setIsAdminLogged, 
            setAdminLoggedIn 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);