import React, { useState } from 'react';
import '../css/AdminHeader.css';
import { useAuthContext } from '../context/AuthContext';
import SweetAlert from './SweetAlert';
import HamburgerIcon from './HamburgerIcon';


const AdminHeader = ({setSideNavOpen}) => {
    const {logoutAdmin, isAdminLogged} = useAuthContext();
    const [showSweetAlert, setShowSweetAlert] = useState();

    return (
        <div className="AdminHeader">
            <div className="upper">
                <div className="openNav">
                    <HamburgerIcon 
                        setSideNavOpen={setSideNavOpen}
                        height={24}
                        width={24}
                    />
                </div>
                <div className="left">
                    <div className="title">
                        <h1>ONLINE EVENT REQUEST</h1>
                        <h1>SYSTEM</h1>
                    </div>
                </div>
                <div className="right">
                    <h3>Welcome, {isAdminLogged.name}</h3>
                    <button onClick={()=> setShowSweetAlert(true)}>Logout</button>
                </div>
            </div>
            <SweetAlert 
                msg="Are you sure you want to leave GCORP?"
                setShowSweetAlert={setShowSweetAlert}
                showSweetAlert={showSweetAlert}
                eventFunction={logoutAdmin}
            />
        </div>
    )
}

export default AdminHeader