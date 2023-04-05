import React from 'react';
import gcorpLogo from '../../images/gcorp.png';
import adminLoginBackground from '../../images/adminLoginBg.png';
import '../../css/AdminLogin.css';

const AdminLogin = () => {
  return (
    <div className="AdminLogin">
        <div className="left">
            <img src={gcorpLogo} alt="gcorp" />
            <input type="text" placeholder="Domain Account" />
            <input type="password" placeholder="Password" />
            <button>LOGIN</button>
            <p>Forgot Password?</p>
            <h3>Developed By: Algoriteam {"(BSIT 2023)"}</h3>
        </div>
        <div className="right">
            <img src={adminLoginBackground} alt="bglogo" />
        </div>
    </div>
  )
}

export default AdminLogin