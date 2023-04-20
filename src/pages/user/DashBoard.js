import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import Axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import '../../css/DashBoard.css';


const DashBoard = () => {
  const { loggedUser } = useAuthContext();
  const [status, setStatus] = useState({});
  const [statusIsLoading, setStatusIsLoading] = useState(true);
  const [statusIsError, setStatusIsError] = useState(false);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await Axios.get(`http://localhost:80/gcorp/api/request/request_from_user.php?id=${loggedUser.id}`);
        setStatus(response.data);
        setStatusIsLoading(false);
      } catch (error) {
        setStatusIsError(true);
      }
    };
    getStatus();
  }, [loggedUser.id]);

  console.log(status?.status);

  return (
    <div className="DashBoard">
      <div className="header">
        <h1>WELCOME TO</h1>
        <h1>GCORP</h1>
      </div>
      <div className="content">
        <p>Hello! {loggedUser.name}</p>
        <div className="time">
          <p>You logged in your account at April 05, 2023,</p>
          <p>09:37pm</p>
        </div>
        <p>Status Request: {status[loggedUser.id]?.status}</p>
      </div>
    </div>
  )
}

export default DashBoard