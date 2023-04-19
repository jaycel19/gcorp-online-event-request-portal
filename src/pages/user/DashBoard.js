import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import Axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import '../../css/DashBoard.css';


const DashBoard = () => {
  const { loggedUser } = useAuthContext();

  

  const { data: user, isLoading, isError } = useQuery(['user'], async () => {
    const response = await Axios.get(`http://localhost:80/gcorp/api/user/single.php?id=${loggedUser.id}`);
    return response.data
  });


  console.log(user);

  return (
    <div className="DashBoard">
        <div className="header">
            <h1>WELCOME TO</h1>
            <h1>GCORP</h1>
        </div>
        <div className="content">
            <p>Hello! {isLoading ? "Loading..." : user[loggedUser.id].name}</p>
            <div className="time">
                <p>You logged in your account at April 05, 2023,</p>
                <p>09:37pm</p>
            </div>
            <p>Status Request: {"(APPROVED/PENDING/CANCELLED)"}</p>
        </div>
    </div>
  )
}

export default DashBoard