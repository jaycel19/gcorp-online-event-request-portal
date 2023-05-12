import React from 'react';
import LoginForm from '../../components/LoginForm';
import '../../css/Login.css';
import LoginLogos from '../../components/LoginLogos';


const Login = () => {



  return (
    <div className="Login">
        <LoginLogos />
        <LoginForm />
    </div>
  )
}

export default Login