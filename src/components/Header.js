import React, { useState } from 'react';
import "../css/Header.css";
import { useAuthContext } from '../context/AuthContext';
import SweetAlert from './SweetAlert';
import HamburgerIcon from './HamburgerIcon';

const Header = ({setSideNavOpen}) => {
    const {loggedUser, logout} = useAuthContext();
    const [showSweetAlert, setShowSweetAlert] = useState(false);

  return (
    <div className="Header">
        <div className="upper">
            <div className="openNav">
                <HamburgerIcon 
                    setSideNavOpen={setSideNavOpen}
                    height={30}
                    width={30}
                />
            </div>
            <div className="right">
                <h3>Welcome, {loggedUser.name}</h3>
                <button onClick={()=> setShowSweetAlert(true)}>Logout</button>
            </div>
        </div>
        <div className="lower">
            <div className="dateTime">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar3" viewBox="0 0 16 16"> <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"/> <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/> </svg>
                <p>Wednesday, April 5, 2023, 7:47 PM</p>
            </div>
        </div>
        <SweetAlert 
            setShowSweetAlert={setShowSweetAlert}
            showSweetAlert={showSweetAlert}
            eventFunction={logout}
            msg="You're leaving GCORP..."
        />
    </div>
  )
}

export default Header