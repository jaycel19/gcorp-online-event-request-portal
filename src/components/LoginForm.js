import React, { useState } from 'react';
import useLogin from '../components/useLogin';
import LoginMessage from './LoginMessage';
import { useAuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const { login, isLoading, error } = useLogin();
  const [domainEmail, setDomainEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {loggedIn, setUserLogged} = useAuthContext();

  const handleLogin = (event) => {
    event.preventDefault();
    login({ domainEmail, password });
    setShowModal(true);
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
      {loggedIn.login ? <LoginMessage showModal={showModal} setShowModal={setShowModal} img={true} msg="LOGIN" success="SUCCESSFULLY" loggedIn={loggedIn} setUserLogged={setUserLogged} /> : <LoginMessage showModal={showModal} setShowModal={setShowModal} img={false} msg="INVALID CREDENTIALS" success="Please try again" setUserLogged={setUserLogged} />}
    </div>
  )
}

export default LoginForm;