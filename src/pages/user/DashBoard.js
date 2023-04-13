import React from 'react';
import '../../css/DashBoard.css';

const DashBoard = () => {
  return (
    <div className="DashBoard">
        <div className="header">
            <h1>WELCOME TO</h1>
            <h1>GCORP</h1>
        </div>
        <div className="content">
            <p>Hello! {"(NAME)"}</p>
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