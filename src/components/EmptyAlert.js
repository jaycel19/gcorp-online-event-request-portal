import React from 'react';
import LoginAlertLogo from '../images/login_alert.png';
import '../css/EmptyAlert.css';

const EmptyAlert = ({isEmpty, setIsEmpty}) => {

    const handleClick = () => {
        setIsEmpty(false);
        window.scrollTo(0, 200);
    }

  return (
    <div className="EmptyAlert" style={{display: `${isEmpty ? 'flex' : 'none'}`}}>
        <div className="modal-content">
            <img src={ LoginAlertLogo } alt="alert_logo" />
            <h2>Empty Fields!</h2>
            <p> Please fill out all fields! </p>
            <div className="btn">
                <button onClick={handleClick}>OK</button>
            </div>
        </div>
    </div>
  )
}

export default EmptyAlert