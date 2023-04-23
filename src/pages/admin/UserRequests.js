import React, { useState, useEffect, useRef } from 'react';
import '../../css/UserRequests.css';
import axios from 'axios';
import UserRequest from '../../components/UserRequest';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);

    const [rerenderCounter, setRerenderCounter] = useState(false);
    console.log(data)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the requests endpoint
                const response = await axios.get('http://localhost/gcorp/api/request/requests.php');
                const requestData = Object.keys(response.data).map(key => {
                    return response.data[key];
                });
                // Fetch materials for each equipment/material item in the requests data
                const updatedData = await Promise.all(requestData.map(async (request) => {
                    const materialResponse = await axios.get(`http://localhost/gcorp/api/material/single.php?id=${request.equipment_materials_id}`);
                    const material = materialResponse.data;
                    console.log(material);
                    // Add the material to the request object
                    return {
                        ...request,
                        material: material,
                    };
                }));
                // Update the state variable with the updated data
                setData(updatedData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [rerenderCounter]);

    const [currentPage, setCurrentPage] = useState(0);
    const entriesPerPage = 3;

    const filteredData = data.filter((item) => {
        // Check if the search term exists in any of the object properties
        return Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

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

    const pdfRef = useRef();

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Facility', 'Title', 'User Name', 'Department', 'Contact Number', 'Status']],
            body: data.map((entry) => [entry.id, entry.facility, entry.title_event, entry.user_name, entry.department, entry.contact_number, entry.status])
        });
        doc.save('user-requests.pdf');
    };

    return (
        <div className="UserRequests">
            <div className="controls">
                <div className="search">
                    <p>SEARCH</p>
                    <input type="text" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="exportButton">
                    <button className="red" style={{
                        cursor: 'pointer'
                    }} onClick={exportPDF}>EXPORT ALL PDF</button>
                    <button className="green"></button>
                </div>
            </div>
            <div className="dataTable" style={{
                height: searchTerm ? '500px' : '',
                overflow: 'auto'
            }}>
                <table>
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody>
                        {searchTerm === "" ? currentEntries?.map((data, key) => (
                            <UserRequest
                                data={data}
                                key={key}
                                setRerenderCounter={setRerenderCounter}
                                rerenderCounter={rerenderCounter}
                            />
                        ))
                            :
                            filteredData?.map((data, key) => (
                                <UserRequest
                                    data={data}
                                    key={key}
                                    setRerenderCounter={setRerenderCounter}
                                    rerenderCounter={rerenderCounter}
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

export default UserRequests;