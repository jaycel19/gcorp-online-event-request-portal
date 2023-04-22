import React, { useState, useEffect } from 'react';
import '../../css/UserRequests.css';
import axios from 'axios';
import UserRequest from '../../components/UserRequest';

const UserRequests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);

    const [rerenderCounter, setRerenderCounter] = useState(false);

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

    const filteredData = data.filter((item) => {
        // Check if the search term exists in any of the object properties
        return Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="UserRequests">
            <div className="controls">
                <div className="search">
                    <p>SEARCH</p>
                    <input type="text" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="exportButton">
                    <button className="red">EXPORT PDF</button>
                    <button className="green">EXPORT EXCEL</button>
                </div>
            </div>
            <div className="dataTable">
                <table>
                    <tr>
                        <th>No.</th>
                        <th>Requestor Full Name</th>
                        <th>Department</th>
                        <th>Contact No.</th>
                        <th>Type of Event</th>
                        <th>Event/Activity Duration</th>
                        <th>Description of Events</th>
                        <th>Equipments/Materials needed</th>
                        <th>Actions</th>
                    </tr>
                    {filteredData?.map((data, key) => (
                        <UserRequest data={data} key={key} setRerenderCounter={setRerenderCounter} rerenderCounter={rerenderCounter} />
                    ))}
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

export default UserRequests;