import React from 'react';
import gcorpLogo from '../images/gcorp.png';
import '../css/AdminHeader.css';

const AdminHeader = () => {
  return (
    <div className="AdminHeader">
        <div className="upper">
            <div className="left">
                <img src={ gcorpLogo } alt="gcorp" />
                <div className="title">
                    <h1>ONLINE EVENT REQUEST</h1>
                    <h1>SYSTEM</h1>
                </div>
            </div>
            <div className="right">
                <h3>Welcome, {"NAME"}</h3>
                <button>→</button>
            </div>
        </div>
        <div className="lower">
            <div className="items">
                <a href="">Dashboard</a>
                <a href="">User Requests</a>
                <a href="">Calendar</a>
            </div>
        </div>
    </div>
  )
}

export default AdminHeader