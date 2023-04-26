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
            <div className="lower">
                <div className="dateTime">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3" viewBox="0 0 16 16"> <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" /> <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /> </svg>
                    <p>{formattedDate}</p>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader