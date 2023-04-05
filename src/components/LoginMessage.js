import React from 'react';
import LoginUnsuccessLogo from '../images/logo_x.png';
import LoginSuccess from '../images/login_check.png'

const LoginMessage = () => {
  return (
    <div>
        <img src={ LoginUnsuccessLogo } alt="x" />
        <h2>INVALID CREDENTIALS</h2>
        <p>Please try again</p>
        <div>
            <button>Ok</button>
        </div>
    </div>
  )
}

export default LoginMessage