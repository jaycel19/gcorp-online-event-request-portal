import React, { useEffect, useState } from 'react';
import '../../css/Users.css';
import axios from 'axios';
import User from '../../components/User';

const Users = () => {
    const [users, setUsers] = useState({});
    const [userRerender, setUserRerender] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost/gcorp/api/user/users.php');
                const data = response.data;
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [userRerender]);
    console.log(users);
    return (
        <div className="Users">
            <div className="controls">
                <div className="search">
                    <p>SEARCH</p>
                    <input type="text" />
                </div>
            </div>
            <div className="dataTable">
                <table>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Domain Email</th>
                        <th>Password</th>
                    </tr>
                    {Object.keys(users).map((key) => {
                        const user = users[key];
                        return (
                            <User
                                data={user}
                                userRerender={userRerender}
                                setUserRerender={setUserRerender}
                            />
                        )
                    })}
                </table>
            </div>
            <div className="pagination">
                <div className="entries">
                    <p>Showing 3 out of 3 entries</p>
                </div>
                <div className="pages">
                    <p>1 pages 2 3</p>
                </div>
            </div>
        </div>
    )
}

export default Users