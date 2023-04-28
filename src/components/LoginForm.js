import React, { useState } from 'react';
import LoginMessage from './LoginMessage';
import { useAuthContext } from '../context/AuthContext';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const LoginForm = () => {
  const [domainEmail, setDomainEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loggedIn, setUserLogged, setLoggedIn } = useAuthContext();


  const loginMutation = useMutation(
    async (loginData) => {
      setIsLoading(true);
      const { data } = await axios.post('http://localhost/gcorp/api/user/login.php', loginData, { headers: { 'Content-Type': 'application/json' } });
      return data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('userData', JSON.stringify(data));
        setLoggedIn(data);
        if (data?.login === true) {
          setUserLogged(data);
          setIsLoading(false);
          MySwal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have successfully logged in!',
          });
        } else {
          setIsLoading(false);
          MySwal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid credentials, please try again!',
          });
        }
      },
      onError: (error) => {
        // handle login error
        MySwal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      },
    }
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!domainEmail || !password) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter your domain account and password!',
      });
    } else {
      loginMutation.mutate({ domainEmail, password });
    }
  };

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
          {isLoading ? "LOADING..." : "LOGIN"}
        </button>
      </div>
      <div className="footer">
        <h2>Developed By: AlgoriTeam {"(BSIT 2023)"}</h2>
      </div>
      <LoginMessage
        setLoggedIn={setLoggedIn}
        showModal={showModal}
        setShowModal={setShowModal}
        loggedIn={loggedIn}
        setUserLogged={setUserLogged} />
    </div>
  )
}

export default LoginForm;