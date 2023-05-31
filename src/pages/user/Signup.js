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
  const [selectedOption, setSelectedOption] = useState("student");
  const [name, setName] = useState("");
  const [idNo, setIdNo] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [domainAccount, setDomainAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleIdNoChange = (e) => {
    setIdNo(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };
  const handleContactNumber = (e) => {
    setContactNumber(e.target.value);
  };
  const handleDomainAccountChange = (e) => {
    setDomainAccount(e.target.value);
  };
  const handleOrganizationChange = (e) => {
    setOrganization(e.target.value);
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

      let userData = {};

      if (selectedOption === "guest") {
        userData = {
          name: name,
          contactNumber: contactNumber,
          organization: organization,
          address: address,
          domainEmail: domainAccount,
          password: password,
          userType: "guestUser",
        };
      } else {
        userData = {
          name: name,
          contactNumber: contactNumber,
          idNo: idNo,
          department: department,
          domainEmail: domainAccount,
          password: password,
          userType: "stdUser",
        };
      }

      const response = await axios.post(
        "https://capstone23.com/gcorp/gcorp-backend/api/user/insert.php",
        userData
      );

      MySwal.fire({
        icon: "success",
        title: "Success",
        text: "Signup Successful!",
      });
      setAddress("");
      setContactNumber("");
      setDepartment("");
      setIdNo("");
      setContactNumber("");
      setName("");
      setDomainAccount("");
      setOrganization("");
      setPassword("");
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

  const handleGuestSubmit = () => {
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
        title: "Are you sure you want to sign up as a guest?",
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

  const handleStudentFacultySubmit = () => {
    if (
      name.trim() === "" ||
      idNo.trim() === "" ||
      department.trim() === "" ||
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
        title: "Are you sure you want to sign up as a student or faculty?",
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

  const handleSubmit = () => {
    if (selectedOption === "guest") {
      handleGuestSubmit();
    } else {
      handleStudentFacultySubmit();
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
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          style={{
            padding: "7px",
            fontSize: "15px",
            border: "1px solid green",
            borderRadius: "7px",
          }}
        >
          <option value="guest">Sign up as guest</option>
          <option value="student">Sign in as Student or Faculty</option>
        </select>
        <div
          className="inputs"
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          {selectedOption === "guest" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                style={{ backgroundColor: "#fff" }}
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
              />
              <input
                style={{
                  backgroundColor: "white",
                }}
                type="text"
                placeholder="Organization"
                value={organization}
                onChange={handleOrganizationChange}
              />
              <input
                style={{
                  backgroundColor: "white",
                }}
                type="text"
                placeholder="Address"
                value={address}
                onChange={handleAddressChange}
              />
            </div>
          )}
          {selectedOption === "student" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                style={{ backgroundColor: "#fff" }}
                placeholder="Name"
                value={name}
                onChange={handleNameChange}
              />
              <input
                style={{
                  backgroundColor: "white",
                }}
                type="text"
                placeholder="ID No"
                value={idNo}
                onChange={handleIdNoChange}
              />
              <select
                style={{
                  width: "90%",
                  padding: "10px",
                  fontSize: "16px",
                  color: "grey",
                  borderRadius: "7px",
                  boxShadow: "0px 5px 6px 0px grey",
                }}
                value={department}
                onChange={handleDepartmentChange}
                placeholder="Department"
              >
                <option value="">CHOOSE DEPARTMENT</option>
                <option value="CCS">CCS</option>
                <option value="CHTM">CHTM</option>
                <option value="CEAS">CEAS</option>
                <option value="CAHS">CAHS</option>
                <option value="CBA">CBA</option>
              </select>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="number"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={handleContactNumber}
              style={{
                backgroundColor: "white",
              }}
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
              <span
                style={{ fontSize: "14px", color: "green", fontWeight: "600" }}
              >
                Your password matched!
              </span>
            ) : (
              <span
                style={{ fontSize: "14px", color: "red", fontWeight: "600" }}
              >
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
          </div>
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
