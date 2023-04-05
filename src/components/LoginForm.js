import React from 'react';

const LoginForm = () => {
  return (
    <div className="LoginForm">
      <div className="header">
        <h1>Welcome User</h1>
        <p>Login your Credentials.</p>
      </div>
      <div className="form">
        <input style={{ backgroundColor:"#fff" }} type="text" placeholder="Domain Account" />
        <input style={{ backgroundColor:"#fff" }} type="password" placeholder="Password" />
        <button>LOGIN</button>
        <p>Forget Password</p>
      </div>
      <div className="footer">
        <h2>Developed By: AlgoriTeam {"(BSIT 2023)"}</h2>
      </div>
    </div>
  )
}

export default LoginForm;