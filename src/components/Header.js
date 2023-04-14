import React from 'react';
import "../css/Header.css";
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../context/AuthContext';
import Axios from "axios";

const Header = () => {
    const {isLogged} = useAuthContext();
    const { data: user, isLoading, isError } = useQuery(['user'], async () => {
        const response = await Axios.get(`http://localhost:80/gcorp/api/user/single.php?id=${isLogged.id}`);
        return response.data;
    });

  return (
    <div className="Header">
        <div className="upper">
            <div className="right">
                <h3>Welcome, {isLoading ? "Loading..." : user[5].name}</h3>
                <button>→</button>
            </div>
        </div>
        <div className="lower">
            <div className="dateTime">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3" viewBox="0 0 16 16"> <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/> <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/> </svg>
                <p>Wednesday, April 5, 2023, 7:47 PM</p>
            </div>
        </div>
    </div>
  )
}

export default Header