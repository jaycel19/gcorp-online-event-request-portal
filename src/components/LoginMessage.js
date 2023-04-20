import LoginUnsuccessLogo from '../images/logo_x.png';
import LoginSuccessLogo from '../images/login_check.png';
import '../css/LoginMessage.css';

const LoginMessage = ({ success, img, showModal, setShowModal, setUserLogged, loggedIn }) => {

  let msg = "";
  if (showModal.msg === 'empty') {
    msg = "EMPTY FIELDS!";
  } else if (showModal.msg === 'success') {
    msg = "LOGIN";
  } else if (showModal.msg === 'invalid') {
    msg = "INVALID CREDENTIALS";
  }

  const handleButton = () => {
    if (showModal.msg === 'empty') {
      setUserLogged({
        login: false
      })
    } else if (showModal.msg === 'success') {
      setUserLogged(loggedIn);
    } else if (showModal.msg === 'invalid') {
      setUserLogged({
        login: false
      })
    }
    setShowModal({
      show: false,
      msg: ''
    });
  }

  return (
    <div className="LoginMessage" style={{ display: `${showModal.show ? "flex" : "none"}` }}>
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