import React from 'react';
import gcorpLogo from '../images/gcorp.png';
import "../css/Header.css";

const Header = () => {
  return (
    <div className="Header">
        <div className="upper">
            <div className="left">
                <img src={ gcorpLogo } alt="gcorp" />
                <div className="title">
                    <h1>GCORP</h1>
                    <h2>USER PORTAL</h2>
                </div>
            </div>
            <div className="right">
                <h3>Welcome, {"NAME"}</h3>
                <button>→</button>
            </div>
        </div>
        <div className="lower">
            <div className="items">
                <a href="">Home</a>
                <a href="">Request Form</a>
                <a href="">About us</a>
            </div>
        </div>
    </div>
  )
}

export default Header