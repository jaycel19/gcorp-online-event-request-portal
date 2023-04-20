import React, { useState } from 'react';
import useLogin from '../components/useLogin';
import LoginMessage from './LoginMessage';
import { useAuthContext } from '../context/AuthContext';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoginForm = () => {
  const { login, isLoading, error } = useLogin();
  const [domainEmail, setDomainEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState({
    show: false,
    msg: ''
  });
  const { loggedIn, setUserLogged, userLogged } = useAuthContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!domainEmail || !password) {
      setShowModal({
        show: true,
        msg: 'empty'
      });
      return;
    }

    try {
      const user = await login({ domainEmail, password });
      setUserLogged(user);
      if (userLogged.login) {
        setShowModal({
          show: true,
          msg: 'success'
        });
      } else {
        setShowModal({
          show: true,
          msg: 'invalid'
        })
      }

    } catch (error) {
      setUserLogged({
        login: false
      });
      setShowModal({
        show: true,
        msg: 'invalid'
      });
    }
  }

  return (
    <div className="LoginForm">
      <div className="header">
        <h1>Welcome User</h1>
        <p>Login your Credentials.</p>
      </div>
      <div className="form">
        <input style={{ backgroundColor: "#fff" }} type="text" placeholder="Domain Account" value={domainEmail} onChange={(e) => setDomainEmail(e.target.value)} />
        <div style={{ position: 'relative' }}>
          <input style={{ backgroundColor: "#fff" }} type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => setShowPassword(!showPassword)} style={{
            padding: '0px',
            marginTop: '0px',
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '25px'
          }}>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        <button type="submit" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'LOGIN'}
        </button>
        {error && <p>{error.message}</p>}
      </div>
      <div className="footer">
        <h2>Developed By: AlgoriTeam {"(BSIT 2023)"}</h2>
      </div>
      {loggedIn?.login ? <LoginMessage showModal={showModal} setShowModal={setShowModal} img={true} success="SUCCESSFULLY" loggedIn={loggedIn} setUserLogged={setUserLogged} /> : <LoginMessage showModal={showModal} setShowModal={setShowModal} img={false} success="Please try again" setUserLogged={setUserLogged} />}
    </div>
  )
}

export default LoginForm;