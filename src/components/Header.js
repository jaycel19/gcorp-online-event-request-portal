import React from 'react';
import "../css/Header.css";
import { useAuthContext } from '../context/AuthContext';
import HamburgerIcon from './HamburgerIcon';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Header = ({ setSideNavOpen }) => {
    const { loggedUser, logout } = useAuthContext();

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
                logout();
            }
        });
    }

    return (
        <div className="Header">
            <div className="upper">
                <div className="openNav">
                    <HamburgerIcon
                        setSideNavOpen={setSideNavOpen}
                        height={50}
                        width={50}
                    />
                </div>
                <div className="right">
                    <h3>Welcome, {loggedUser.name}</h3>
                    <button onClick={handleLogout} style={{cursor: 'pointer'}}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Header