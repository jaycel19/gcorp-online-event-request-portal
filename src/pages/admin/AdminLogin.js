import React, { useState } from 'react';
import gcLogo from '../../images/gclogo.png';
import '../../css/AdminLogin.css';
import { useAuthContext } from '../../context/AuthContext';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';

const MySwal = withReactContent(Swal);

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAdminLogged } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState();

  const navigate = useNavigate();

  const loginMutation = useMutation(
    async (loginData) => {
      setIsLoading(true);
      const { data } = await axios.post('https://capstone23.com/gcorp/gcorp-backend/api/admin/login.php', loginData, { headers: { 'Content-Type': 'application/json' } });
      return data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('adminData', JSON.stringify(data));
        setIsAdminLogged(data);
        if (data?.login === true) {
          setIsAdminLogged(data);
          setIsLoading(false);
          navigate('', { replace: true })
          MySwal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have successfully logged in!',
          });
        } else {
          setIsLoading(false)
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
    if (!username || !password) {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter your username and password!',
      });
    } else {
      loginMutation.mutate({ username, password });
    }
  };

  return (
    <div className="AdminLogin">
      <div className="adminImages">
        <div className='img'>
        <img src={gcLogo} alt="gc logo" />
        </div>
        <h2 style={{marginTop: '20px'}}>GORDON COLLEGE REQUEST EVENT</h2>
        <h2 style={{marginBottom: '20px', fontWeight: '500'}}>ADMIN PORTAL</h2>
      </div>
      <div className="left">
        <p>Login your credentials</p>
        <div className="in">
          <input type="text" className="username-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="in" style={{ position: 'relative' }}>
          <input style={{ backgroundColor: "#fff", width: "80%" }} type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => setShowPassword(!showPassword)} style={{
            padding: '0px',
            marginRight: '30px',
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
          {isLoading ? 'LOADING...' : 'LOGIN'}
        </button>
        <h3>Developed By: Algoriteam {"(BSIT 2023)"}</h3>
      </div>
    </div>
  )
}

export default AdminLogin