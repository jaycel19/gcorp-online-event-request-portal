import React, { useState } from 'react';
import '../css/AdminHeader.css';
import { useAuthContext } from '../context/AuthContext';
import HamburgerIcon from './HamburgerIcon';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AdminHeader = ({ setSideNavOpen }) => {
    const { logoutAdmin, isAdminLogged } = useAuthContext();
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = date.toLocaleString('en-US', options);
    const handleLogout = () => {
        MySwal.fire({
            title: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                logoutAdmin();
            }
        });
    }

    return (
        <div className="AdminHeader">
            <div className="upper">
                <div className="openNav">
                    <HamburgerIcon
                        setSideNavOpen={setSideNavOpen}
                        height={50}
                        width={50}
                    />
                </div>
                <div className="right">
                    <h3>Welcome, {isAdminLogged.name}</h3>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader