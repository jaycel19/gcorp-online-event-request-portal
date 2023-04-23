import React, { useEffect, useState } from 'react';
import '../../css/Users.css';
import axios from 'axios';
import User from '../../components/User';

const Users = () => {
    const [users, setUsers] = useState({});
    const [userRerender, setUserRerender] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost/gcorp/api/user/users.php');
                const data = response.data;
                setUsers(data);
                setFilteredData(Object.values(data));
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [userRerender]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const filteredUsers = Object.values(users).filter(user =>
            user.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredData(filteredUsers);
    }

    const [currentPage, setCurrentPage] = useState(0);
    const entriesPerPage = 7;

    const indexOfLastEntry = (currentPage + 1) * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const handlePageClick = (pageNumber) => {
        if (pageNumber === totalPages) {
            setCurrentPage(totalPages - 1);
        } else {
            setCurrentPage(pageNumber - 1);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const pageRangeStart = currentPage < 1 ? 0 : currentPage - 1;
        const pageRangeEnd = pageRangeStart + 2 > totalPages - 1 ? totalPages - 1 : pageRangeStart + 2;
        for (let i = pageRangeStart; i <= pageRangeEnd; i++) {
            pageNumbers.push(
                <span style={{
                    cursor: 'pointer',
                    backgroundColor: 'green',
                    padding: '5px 10px',
                    color: '#fff',
                    "&:hover": {
                        backgroundColor: "#0f6626"
                    }
                }} key={i} onClick={() => handlePageClick(i + 1)}>
                    {i + 1}
                </span>
            );
        }
        return (
            <p>
                {currentPage + 1} pages {pageNumbers}
            </p>
        );
    };

    return (
        <div className="Users">
            <div className="controls">
                <div className="search">
                    <p>SEARCH</p>
                    <input type="text" value={searchTerm} onChange={handleSearch} />
                </div>
            </div>
            <div className="dataTable" style={{
                height: searchTerm ? '500px' : '',
                overflow: 'auto',
            }}>
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Domain Email</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchTerm === "" ? currentEntries?.map((data, key) => (
                            <User
                                key={key}
                                data={data}
                                userRerender={userRerender}
                                setUserRerender={setUserRerender}
                            />
                        ))
                            :
                            filteredData?.map((data, key) => (
                                <User
                                    key={key}
                                    data={data}
                                    userRerender={userRerender}
                                    setUserRerender={setUserRerender}
                                />
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {searchTerm === "" ?
                <div className="pagination">
                    <div className="entries">
                        <p>
                            Showing {indexOfFirstEntry + 1} to {indexOfLastEntry > filteredData.length ? filteredData.length : indexOfLastEntry} of {filteredData.length} entries
                        </p>
                    </div>
                    <div className="pages">
                        <div className="pages">{renderPageNumbers()}</div>
                    </div>
                </div>
                :
                ''
            }
        </div>
    );
};

export default Users;