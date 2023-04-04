import React from 'react';
import LoginLogos from '../components/LoginLogos';
import LoginForm from '../components/LoginForm';
import '../css/Login.css';

const Login = () => {
  return (
    <div className="Login">
        <LoginLogos />
        <LoginForm />
    </div>
  )
}

export default Login