import React, { useState } from 'react';
import gcorpLogo from '../../images/gcorp.png';
import adminLoginBackground from '../../images/adminLoginBg.png';
import '../../css/AdminLogin.css';
import useAdminLogin from '../../components/useAdminLogin';
import LoginMessage from '../../components/LoginMessage';
import { useAuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const { adminLogin, isLoading, error } = useAdminLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const {adminLoggedIn, setIsAdminLogged} = useAuthContext();

  const handleLogin = (event) => {
    event.preventDefault();
    adminLogin({ username, password });
    setShowModal(true);
  }

  return (
    <div className="AdminLogin">
        <div className="left">
            <img src={gcorpLogo} alt="gcorp" />
            <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
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