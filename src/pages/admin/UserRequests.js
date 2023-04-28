import React, { useState, useEffect, useRef } from 'react';
import '../../css/UserRequests.css';
import axios from 'axios';
import UserRequest from '../../components/UserRequest';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { utils, writeFile } from 'xlsx';

const UserRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [rerenderCounter, setRerenderCounter] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }


    const exportToExcel = (data) => {
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Requests");

        writeFile(workbook, 'requests.xlsx');
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the requests endpoint
                setIsLoading(true)
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
                const converted = updatedData.map(obj => ({
                    ...obj,
                    duration_from: new Date(obj.duration_from).toLocaleString('en-US', options),
                    duration_to: new Date(obj.duration_to).toLocaleString('en-US', options),
                    duration_from_time: new Date(obj.duration_from + ' ' + obj.duration_from_time).toLocaleTimeString('en-US', timeOptions),
                    duration_to_time: new Date(obj.duration_to + ' ' + obj.duration_to_time).toLocaleTimeString('en-US', timeOptions),
                }));
                setData(converted);
                setIsLoading(false);
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
                    <button className="green" onClick={() => exportToExcel(data)}>EXPORT ALL EXCEL</button>
                </div>
            </div>
            <div className="dataTable" style={{
                height: searchTerm ? '500px' : '',
                overflow: searchTerm ? 'auto' : ''
            }}>
                <table>
                    <thead>
                        <tr>
                            <th>Unique&nbsp;Id</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Contact&nbsp;Number</th>
                            <th>Event&nbsp;Type</th>
                            <th>Duration</th>
                            <th>Event&nbsp;Description</th>
                            <th>Equipments/Materials</th>
                        </tr>
                    </thead>
                    {isLoading ? <div style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <h1>LOADING...</h1>
                    </div> : 
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
                    }
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