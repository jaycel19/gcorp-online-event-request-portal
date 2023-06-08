import { createContext, useContext, useState, } from "react";

const SingleRequestContext = createContext();

export const SingleRequestContextProvider = ({ children }) => {

    const [requestData, setRequestData] = useState({});

    return (
        <SingleRequestContext.Provider value={{
            setRequestData,
            requestData
        }}>
            {children}
        </SingleRequestContext.Provider>
    );
};

export const useSingleRequestContext = () => useContext(SingleRequestContext);