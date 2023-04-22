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
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // update every second
    const getStatus = async () => {
      try {
        const response = await Axios.get(`https://gcorp-event-request.000webhostapp.com/api/request/request_from_user.php?id=${loggedUser.id}`);
        setStatus(response.data);
        setStatusIsLoading(false);
      } catch (error) {
        setStatusIsError(true);
      }
    };
    getStatus();
    return () => clearInterval(intervalId); // clea
  }, [loggedUser.id]);

  const formattedDate = dateTime.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = dateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });


  return (
    <div className="DashBoard">
      <div className="header">
        <h1>WELCOME TO</h1>
        <h1>GCORP</h1>
      </div>
      <div className="content">
        <p>Hello! {loggedUser.name}</p>
        <div className="time">
          <p>You logged in your account at {formattedDate},</p>
          <p>{formattedTime}</p>
        </div>
        <p>Status Request: {status[loggedUser.id]?.status}</p>
      </div>
    </div>
  )
}

export default DashBoard