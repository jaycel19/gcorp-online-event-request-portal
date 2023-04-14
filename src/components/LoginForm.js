import React, { useState } from 'react';
import useLogin from '../components/useLogin';

const LoginForm = () => {
  const { login, isLoading, error } = useLogin();
  const [domainEmail, setDomainEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    login({ domainEmail, password });
  }

  return (
    <div className="LoginForm">
      <div className="header">
        <h1>Welcome User</h1>
        <p>Login your Credentials.</p>
      </div>
      <div className="form">
        <input style={{ backgroundColor:"#fff" }} type="text" placeholder="Domain Account" value={domainEmail} onChange={(e) => setDomainEmail(e.target.value)} />
        <input style={{ backgroundColor:"#fff" }} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'LOGIN'}
        </button>
        {error && <p>{error.message}</p>}
      </div>
      <div className="footer">
        <h2>Developed By: AlgoriTeam {"(BSIT 2023)"}</h2>
      </div>
    </div>
  )
}

export default LoginForm;