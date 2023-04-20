import { createContext, useContext, useState, } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const getStoredUserData = () => {
        const storedData = localStorage.getItem('userData');
        if(storedData) {
            return JSON.parse(storedData);
        }

        return {
            login: false
        }

    }

    const logout = () => {
        setUserLogged({
            login: false
        })
        navigate('/', {replace: true});
        localStorage.removeItem('userData');
    }


    const getStoredAdminData = () => {
        const storedData = localStorage.getItem('adminData');
        if(storedData) {
            return JSON.parse(storedData);
        }

        return {
            login: false
        }

    }

    const logoutAdmin = () => {
        setIsAdminLogged({
            login: false
        })
        localStorage.removeItem('adminData');
    }

    const [loggedUser, setUserLogged] = useState(getStoredUserData());
    const [loggedIn, setLoggedIn] = useState({
        login: false
    });

    const [isAdminLogged, setIsAdminLogged] = useState(getStoredAdminData());
    const [adminLoggedIn, setAdminLoggedIn] = useState({
        login: false
    });

    return(
        <AuthContext.Provider value={{ 
            loggedUser,
            loggedIn,
            setUserLogged, 
            setLoggedIn, 
            isAdminLogged, 
            adminLoggedIn, 
            setIsAdminLogged, 
            setAdminLoggedIn,
            logout,
            logoutAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);