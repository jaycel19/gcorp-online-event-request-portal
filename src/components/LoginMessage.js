import LoginUnsuccessLogo from '../images/logo_x.png';
import LoginSuccessLogo from '../images/login_check.png';
import '../css/LoginMessage.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const LoginMessage = ({ showModal, setShowModal, setUserLogged, loggedIn }) => {
  let img;
  let success = ""
  let msg = "";

  if (loggedIn?.login === true) {
    msg = "LOGIN";
    img = true;
    success = "Successfully logged in";
  } else if (loggedIn?.login === false) {
    img = false;
    msg = "INVALID";
    success = "Invalid credentials please try again.";
  } else if (!loggedIn) {
    msg = "EMPTY FIELDS";
  }

  const handleButton = () => {
    if (loggedIn?.login === false) {
      setShowModal(false);
    } else if (loggedIn?.login === true) {
      setUserLogged(loggedIn);
    } else if (!loggedIn) {
      setShowModal(false);
    }
  }
  return (
    <div className="LoginMessage" style={{ display: `${showModal ? "flex" : "none"}` }}>
      <div className="modal-content">
        <img src={img ? LoginSuccessLogo : LoginUnsuccessLogo} alt={img} />
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