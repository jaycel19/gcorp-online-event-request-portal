import React, { useState } from 'react';
import '../css/UserUpdate.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserUpdate = ({ showUpdate, setShowUpdate, data, userRerender, setUserRerender }) => {
    const [userUpdated, setUserUpdated] = useState({});
    const [isLoading, setIsLoading] =  useState(false);
    const [userData, setUserData] = useState({
        id: data.id,
        name: data.name,
        department: data.department,
        domainEmail: data.domainEmail,
        password: data.password
    })

    const updateUser = async (userData) => {
        setIsLoading(true)
        try {
            const response = await axios.put('http://localhost/gcorp/api/user/update.php', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setUserUpdated(response.data);
            setUserRerender(!userRerender);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to update this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                updateUser(userData);
                setShowUpdate(false);
            }
        });
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
                <div style={{
                    display: 'flex',
                    width: '100%',
                    marginBottom: '100px',
                    justifyContent: 'flex-end'
                }}>
                    <button style={{
                        backgroundColor: '#fff',
                        border: 'none',
                        fontWeight: '1000',
                        fontSize: '17px'
                    }}>x</button>
                </div>
                <h1>Update User</h1>
                <select value={userData.department} onChange={handleDepartmentChange}>
                    <option value="CBA">CBA</option>
                    <option value="CCS">CCS</option>
                    <option value="CEAS">CEAS</option>
                    <option value="CHTM">CHTM</option>
                    <option value="CAHS">CAHS</option>
                </select>
                <input type="text" placeholder="Name" value={userData.name} onChange={handleNameChange} />
                <input type="email" placeholder="Domain Email" value={userData.domainEmail} onChange={handleDomainEmailChange} />
                <input type="password" placeholder="Password" value={userData.password} onChange={handlePasswordChange} />
                <button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'LOADING...' : 'Submit user'}</button>
            </div>
        </div>
    )
}

export default UserUpdate