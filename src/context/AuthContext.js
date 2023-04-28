import { createContext, useContext, useState, } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {


    const navigate = useNavigate();

    const getStoredUserData = () => {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            return JSON.parse(storedData);
        }

        return {
            login: false
        }

    }

    const getStoredAdminData = () => {
        const storedData = localStorage.getItem('adminData');
        if (storedData) {
            return JSON.parse(storedData);
        }

        return {
            login: false
        }

    }

    const [loggedUser, setUserLogged] = useState(getStoredUserData());
    const [loggedIn, setLoggedIn] = useState({
        login: false
    });

    const [isAdminLogged, setIsAdminLogged] = useState(getStoredAdminData());
    const [adminLoggedIn, setAdminLoggedIn] = useState({
        login: false
    });

    const logout = () => {
        setUserLogged({
            login: false
        })
        setLoggedIn({
            login: false
        })
        navigate('/', { replace: true });
        localStorage.removeItem('userData');
    }




    const logoutAdmin = () => {
        setIsAdminLogged({
            login: false
        })
        setAdminLoggedIn({
            login: false
        })
        localStorage.removeItem('adminData');
    }

    const [isLoading, setIsloading] = useState(false);

    return (
        <AuthContext.Provider value={{
            isLoading,
            setIsloading,
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