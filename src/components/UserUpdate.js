import React, { useState } from "react";
import "../css/UserUpdate.css";
import axios from "axios";
import Swal from "sweetalert2";

const UserUpdate = ({
  showUpdate,
  setShowUpdate,
  data,
  userRerender,
  setUserRerender,
}) => {
  const [userUpdated, setUserUpdated] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    id: data.id,
    name: data.name,
    department: data.department,
    domainEmail: data.domainEmail,
    password: data.password,
    organization: data.organization,
    contactNumber: data.contactNumber,
    address: data.address
  });

  const updateUser = async (userData) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "https://capstone23.com/gcorp/gcorp-backend/api/user/update.php",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserUpdated(response.data);
      setUserRerender(!userRerender);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to update this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUser(userData);
        setShowUpdate(false);
      }
    });
  };

  const handleNameChange = (event) => {
    setUserData({ ...userData, name: event.target.value });
  };
const handleAddressChange = (event) => {
    setUserData({ ...userData, address: event.target.value });
  };
  const handleDepartmentChange = (event) => {
    setUserData({ ...userData, department: event.target.value });
  };
  const handleContactNumber = (event) => {
    setUserData({ ...userData, contactNumber: event.target.value });
  };
  const handleOrganizationChange = (event) => {
    setUserData({ ...userData, organization: event.target.value });
  };
  const handleDomainEmailChange = (event) => {
    setUserData({ ...userData, domainEmail: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setUserData({ ...userData, password: event.target.value });
  };


  return (
    <div
      className="UserUpdate"
      style={{ display: `${showUpdate ? "flex" : "none"}` }}
    >
      <div
        className="modal-content"
        style={{
          borderLeft: "10px solid green",
          borderRadius: "10px",
          height: "90%",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-start",
          }}
        >
          <button
            style={{
              backgroundColor: "#fff",
              border: "none",
              fontWeight: "1000",
              fontSize: "17px",
              cursor: "pointer",
              color: "#000",
              marginTop: "0px",
            }}
            onClick={() => setShowUpdate(false)}
          >
            x
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "80%",
            height: "90%",
            borderRadius: "5px",
            boxShadow: "1px 1px 5px #000",
          }}
        >
          <h1>UPDATE USER</h1>
          {data.userType === "stdUser" ? (
            <>
              <input
                type="text"
                value={userData.department}
                onChange={handleDepartmentChange}
              />
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={handleNameChange}
              />
              <input
                type="number"
                placeholder="Contact Number"
                value={userData.contactNumber}
                onChange={handleContactNumber}
              />
              <input
                type="email"
                placeholder="Domain Email"
                value={userData.domainEmail}
                onChange={handleDomainEmailChange}
              />
              <input
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={handlePasswordChange}
              />
            </>
          ) : (
            <>
              <input
                value={userData.organization}
                onChange={handleOrganizationChange}
                type="text"
                placeholder="Organization"
              />
              <input
                value={userData.address}
                onChange={handleAddressChange}
                type="text"
                placeholder="Address"
                />
              <input
                value={userData.contactNumber}
                onChange={handleContactNumber}
                type="number"
                placeholder="Contact Number"
              />
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={handleNameChange}
              />
              <input
                type="email"
                placeholder="Domain Email"
                value={userData.domainEmail}
                onChange={handleDomainEmailChange}
              />
              <input
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={handlePasswordChange}
              />
            </>
          )}
          <button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "LOADING..." : "Submit user"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserUpdate;
