import React from 'react';
import gordonCollegeLogo from '../images/gordonCollege.png';
import gcorpLogo from '../images/gcorp.png';

const LoginLogos = () => {
  return (
    <div className="LoginLogos">
        <h1>GCORP</h1>
        <h2>ONLINE EVENT REQUEST</h2>
        <h2>PORTAL</h2>
        <div className="logos">
            <img src={ gordonCollegeLogo } />
            <img src={ gcorpLogo } />
        </div>
    </div>
  )
}

export default LoginLogos