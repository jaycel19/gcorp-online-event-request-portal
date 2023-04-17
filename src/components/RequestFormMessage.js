import React from 'react';
import LoginSuccessLogo from "../images/login_check.png";
import LoginAlertLogo from "../images/login_alert.png";
import "../css/RequestFormMessage.css";
import { useState } from 'react';

const RequestFormMessage = ({ setToSubmit, toSubmit, handleSubmit }) => {
  const [ isSubmitted, setIsSubmitted ] = useState(false);
  const handleHideModal = () => {
    setToSubmit(false);
  }

  const handleSubmitted = () => {
    setIsSubmitted(true);
    handleSubmit();
  }

  return (
    <div className="RequestFormMessage" style={{ display: `${toSubmit ? 'flex' : 'none'}` }}>
        <div className="modal-content">
            <img src={!isSubmitted ? LoginAlertLogo : LoginSuccessLogo } alt="alert_logo" />
            <h2>{!isSubmitted ? "Are you sure?" : "Request Submitted"}</h2>
            <p> {!isSubmitted ? "Do you want to continue?" : "Kindly wait for the approval of Admin"} </p>
            <div className="btn">
                {!isSubmitted ? <>
                  <button onClick={handleSubmitted}>Yes</button>
                  <button onClick={handleHideModal}>No</button>
                </> : <button onClick={handleHideModal}>Ok</button>}
            </div>
        </div>
    </div>
  )
}

export default RequestFormMessage