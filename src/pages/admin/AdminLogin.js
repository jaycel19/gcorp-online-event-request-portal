import React, { useState } from 'react';
import gcorpLogo from '../../images/gcorp.png';
import adminLoginBackground from '../../images/adminLoginBg.png';
import '../../css/AdminLogin.css';
import useAdminLogin from '../../components/useAdminLogin';
import LoginMessage from '../../components/LoginMessage';
import { useAuthContext } from '../../context/AuthContext';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminLogin = () => {
  const { adminLogin, isLoading, error } = useAdminLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { adminLoggedIn, setIsAdminLogged, isAdminLogged } = useAuthContext();
  const [showPassword, setShowPassword] = useState();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setShowModal({
        show: true,
        msg: 'empty'
      });
      return;
    }

    try {
      const user = await adminLogin({ username, password });
      setIsAdminLogged(user);
      if (isAdminLogged.login) {
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
      setIsAdminLogged({
        login: false
      });
      setShowModal({
        show: true,
        msg: 'invalid'
      });
    }
  }

  return (
    <div className="AdminLogin">
      <div className="left">
        <img src={gcorpLogo} alt="gcorp" />
        <h1>Welcome Administrator</h1>
        <h2>Login your credentials</h2>
        <div className="in">
          <input type="text" className="username-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="in" style={{ position: 'relative' }}>
          <input style={{ backgroundColor: "#fff", width: "90%" }} type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => setShowPassword(!showPassword)} style={{
            padding: '0px',
            marginRight: '15px',
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
        <h3>Developed By: Algoriteam {"(BSIT 2023)"}</h3>
      </div>
      <div className="right">
        <img src={adminLoginBackground} alt="bglogo" />
      </div>
      {adminLoggedIn.login ? <LoginMessage
        showModal={showModal}
        setShowModal={setShowModal}
        img={true} msg="LOGIN"
        success="SUCCESSFULLY"
        loggedIn={adminLoggedIn}
        setUserLogged={setIsAdminLogged}
      />
        :
        <LoginMessage
          showModal={showModal}
          setShowModal={setShowModal}
          img={false}
          msg="INVALID CREDENTIALS"
          success="Please try again"
          loggedIn={adminLoggedIn}
          setUserLogged={setIsAdminLogged} />
      }
    </div>
  )
}

export default AdminLogin