import React from 'react';
import gcorpLogo from '../images/gcorp.png';
import '../css/AdminHeader.css';
import { useAuthContext } from '../context/AuthContext';


const AdminHeader = () => {
    const {logoutAdmin, isAdminLogged} = useAuthContext();
    return (
        <div className="AdminHeader">
            <div className="upper">
                <div className="left">
                    <img src={gcorpLogo} alt="gcorp" />
                    <div className="title">
                        <h1>ONLINE EVENT REQUEST</h1>
                        <h1>SYSTEM</h1>
                    </div>
                </div>
                <div className="right">
                    <h3>Welcome, {isAdminLogged.name}</h3>
                    <button onClick={logoutAdmin}>→</button>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader