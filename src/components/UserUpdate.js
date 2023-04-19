import React, { useState } from 'react';
import '../css/UserUpdate.css';
import axios from 'axios';

const UserUpdate = ({ showUpdate, setShowUpdate, data, userRerender, setUserRerender }) => {
    const [userUpdated, setUserUpdated] = useState({});
    const [userData, setUserData] = useState({
        id: data.id,
        name: data.name,
        department: data.department,
        domainEmail: data.domainEmail,
        password: data.password
    })

    const updateUser = async (userData) => {
        try {
            const response = await axios.put('http://localhost/gcorp/api/user/update.php', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUserUpdated(response.data);
            setUserRerender(!userRerender);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = () => {
        updateUser(userData);
        setShowUpdate(false);
    }

    const handleNameChange = (event) => {
        setUserData({...userData, name: event.target.value});
    }

    const handleDepartmentChange = (event) => {
        setUserData({...userData, department: event.target.value});
    }

    const handleDomainEmailChange = (event) => {
        setUserData({...userData, domainEmail: event.target.value});
    }

    const handlePasswordChange = (event) => {
        setUserData({...userData, password: event.target.value});
    }

    console.log(userData);

    return (
        <div className="UserUpdate" style={{ display: `${showUpdate ? 'flex' : 'none'}` }}>
            <div className="modal-content">
                <h1>Update User</h1>
                <select value={userData.department} onChange={handleDepartmentChange}>
                    <option value="CBA">CBA</option>
                    <option value="CSS">CSS</option>
                    <option value="CEAS">CEAS</option>
                    <option value="CHTM">CHTM</option>
                    <option value="CAHS">CAHS</option>
                </select>
                <input type="text" placeholder="Name" value={userData.name} onChange={handleNameChange} />
                <input type="email" placeholder="Domain Email" value={userData.domainEmail} onChange={handleDomainEmailChange} />
                <input type="password" placeholder="Password" value={userData.password} onChange={handlePasswordChange} />
                <button onClick={handleSubmit}>Submit User</button>
            </div>
        </div>
    )
}

export default UserUpdate