import React from 'react';
import LogoAlert from '../images/login_alert.png';
import '../css/SweetAlert.css';

const SweetAlert = ({ msg, setShowSweetAlert, eventFunction, showSweetAlert }) => {

    const handleYes = () => {
        setShowSweetAlert(false);
        eventFunction();
    }

    return (
        <div className="SweetAlert" style={{display: `${showSweetAlert ? 'flex' : 'none'}`}}>
            <div className="modal-content">
                <img src={LogoAlert} alte="Alert" />
                <h1>{msg}</h1>
                <div className="buttons">
                    <button onClick={handleYes}>Yes</button>
                    <button onClick={() => setShowSweetAlert(false)}>No</button>
                </div>
            </div>
        </div>
    )
}

export default SweetAlert