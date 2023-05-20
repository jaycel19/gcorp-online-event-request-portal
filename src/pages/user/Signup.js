import React, { useState } from "react";
import gcLogo from "../../images/gclogo.png";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../css/Signup.css";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [name, setName] = useState("");
  const [domainAccount, setDomainAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDomainAccountChange = (e) => {
    setDomainAccount(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    if (value === password) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
    setConfirmPassword(value);
  };

  const MySwal = withReactContent(Swal);

  const insertUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://capstone23.com/gcorp/gcorp-backend/api/user/insert.php",
        {
          name: name,
          department: "",
          domainEmail: domainAccount,
          password: password,
        }
      );
      MySwal.fire({
        icon: "success",
        title: "Success",
        text: "Signup Successful!",
      });
      setIsLoading(false);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Signup Failed!",
      });
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (
      name.trim() === "" ||
      domainAccount.trim() === "" ||
      password.trim() === ""
    ) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all fields.",
      });
    } else {
      MySwal.fire({
        icon: "question",
        title: "Are you sure you want to sign up?",
        showCancelButton: true,
        confirmButtonText: "Yes, sign me up!",
        cancelButtonText: "No, cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          insertUser();
        }
      });
    }
  };

  return (
    <div className="Signup">
      <div className="logos">
        <img src={gcLogo} alt="gclogo" />
        <h2>GORDON COLLEGE EVENT REQUEST</h2>
        <h2>USERS SIGNUP</h2>
      </div>
      <div className="form">
        <div className="header">
          <p>Enter your information.</p>
        </div>
        <input
          type="text"
          style={{ backgroundColor: "#fff" }}
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
        />
        <input
          type="email"
          placeholder="Email"
          value={domainAccount}
          onChange={handleDomainAccountChange}
        />
        <div style={{ position: "relative" }}>
          <input
            style={{ backgroundColor: "#fff" }}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              padding: "0px",
              marginTop: "0px",
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "25px",
            }}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        {confirmed == null ? (
          ""
        ) : confirmed ? (
          <span style={{ fontSize: "14px", color: "green", fontWeight: "600" }}>
            Your password matched!
          </span>
        ) : (
          <span style={{ fontSize: "14px", color: "red", fontWeight: "600" }}>
            Your password does not match!
          </span>
        )}
        <div style={{ position: "relative" }}>
          <input
            style={{ backgroundColor: "#fff" }}
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              padding: "0px",
              marginTop: "0px",
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "25px",
            }}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        <Link to="/gcorp/">Login</Link>
        <button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign up"}
        </button>
        <div className="disclaim">
          <p>
            By clicking the login button, you recognize the authority of Gordon
            College to process your personal and sensitive information, pursuant
            to the{" "}
            <a
              href="https://gordoncollegeccs.edu.ph/datapolicy/"
              target="_blank"
            >
              Gordon College General Privacy Notice
            </a>{" "}
            and applicable laws.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
