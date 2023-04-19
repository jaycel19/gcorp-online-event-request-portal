import LoginUnsuccessLogo from '../images/logo_x.png';
import LoginSuccessLogo from '../images/login_check.png';
import '../css/LoginMessage.css';
import { useNavigate } from 'react-router-dom';

const LoginMessage = ({msg, success, img, showModal, setShowModal, setUserLogged, loggedIn}) => {

  const navigate = useNavigate();

  const handleButton = () => {
    setUserLogged(loggedIn);
    setShowModal(false);
    navigate('/', {replace: true});
  }

  return (
    <div className="LoginMessage" style={{display: `${showModal ? "flex"  : "none"}`}}>
      <div className="modal-content">
        <img src={img ? LoginSuccessLogo : LoginUnsuccessLogo } alt={img} />
        <h2>{msg}</h2>
        <p>{success}</p>
        <div className="btn">
            <button onClick={handleButton}>OKAY</button>
        </div>
      </div>
    </div>
  )
}

export default LoginMessage