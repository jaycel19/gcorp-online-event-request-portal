import React, { useState } from 'react';
import RequestUpdate from './RequestUpdate';
import RequestView from './RequestView';
import axios from 'axios';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';


const UserRequest = ({ data, setRerenderCounter, rerenderCounter }) => {
    const [showUpdate, setShowUpdate] = useState(false);

    const [singleRequest, setSingleRequest] = useState({});
    const [viewSingle, setViewSingle] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState();

    const getSingleRequest = async (id, data) => {
        try {
            const response = await axios.get(`http://localhost/gcorp/api/request/single.php?id=${id}`);
            setSingleRequest(response.data[data.id]);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteRequest = async (id) => {
        try {
            const response = await axios.delete(`http://localhost/gcorp/api/request/destroy.php`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: id
            })
            setDeleteSuccess((prev) => {
                return {
                    ...prev,
                    deleted: response.data
                }
            })
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const deleteMaterial = async (id) => {
        try {
            const response = await axios.delete(`http://localhost/gcorp/api/material/destroy.php`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: id
            })
            setDeleteSuccess((prev) => {
                return {
                    ...prev,
                    deleted: response.data
                }
            })
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    const updateStatus = async (data) => {
        try {
            const response = await axios.put('http://localhost/gcorp/api/request/update_status.php', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleApprove = () => {
        Swal.fire({
            title: 'Are you sure you want to approve this request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus({
                    id: data.id,
                    status: "approve"
                });
                setRerenderCounter(!rerenderCounter);
            }
        });
    }

    const handleReject = () => {
        Swal.fire({
            title: 'Are you sure you want to reject this request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus({
                    id: data.id,
                    status: "cancelled"
                })
                
                setRerenderCounter(!rerenderCounter);
            }
        });
    }

    const handleViewRequest = () => {
        getSingleRequest(data.id, data);
        setViewSingle(true);
    }



    const handleDelete = () => {
        const id = {
            id: data.id
        };
        const matId = {
            id: data.equipment_materials_id
        };

        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this request!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest(id);
                deleteMaterial(matId);
                Swal.fire(
                    'Deleted!',
                    'Your request has been deleted.',
                    'success'
                );
            }
        });
    };
    return (
        <>
            <tr>
                <td>{data.id}</td>
                <td className="username">{data.user_name}</td>
                <td>{data.department}</td>
                <td>{data.contact_number}</td>
                <td>{data.type_of_event}</td>
                <td>{data.duration_from}  {data.duration_from_time}, {data.duration_to} {data.duration_to_time} </td>
                <td className="description">{data.description_of_activity.slice(0, 15)}...</td>
                <td className="equips">
                    <p>Monoblock Single {`(${data.material[data.equipment_materials_id].monoblock_single})`} Armchairs {`(${data.material[data.equipment_materials_id].armchairs})`}</p>
                    <p>Microphones {`(${data.material[data.equipment_materials_id].microphones})`} Speakers {`(${data.material[data.equipment_materials_id].speakers})`}</p>
                    <p>Whiteboard {`(${data.material[data.equipment_materials_id].whiteboard})`} Tables {`(${data.material[data.equipment_materials_id].tables})`}</p>
                </td>
                <td className="buttons">
                    <button className="actions edit" onClick={() => setShowUpdate(true)}>
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.3033 2.08777L16.9113 0.695801C16.4478 0.231934 15.8399 0 15.2321 0C14.6242 0 14.0164 0.231934 13.5525 0.69543L0.475916 13.772L0.00462689 18.0107C-0.0547481 18.5443 0.365701 19 0.88783 19C0.920858 19 0.953885 18.9981 0.987654 18.9944L5.22332 18.5265L18.3036 5.44617C19.231 4.51881 19.231 3.01514 18.3033 2.08777ZM4.67818 17.3924L1.2259 17.775L1.61035 14.3175L11.4031 4.52475L14.4747 7.59629L4.67818 17.3924ZM17.4639 4.60676L15.3141 6.7565L12.2426 3.68496L14.3923 1.53521C14.6164 1.31107 14.9148 1.1875 15.2321 1.1875C15.5494 1.1875 15.8474 1.31107 16.0719 1.53521L17.4639 2.92719C17.9266 3.39031 17.9266 4.14363 17.4639 4.60676Z" fill="#FEAF00" />
                        </svg>
                    </button>
                    <button className="actions delete" onClick={handleDelete}>
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.285713 2.25H4L5.2 0.675C5.35968 0.465419 5.56674 0.295313 5.80478 0.178154C6.04281 0.0609948 6.30529 0 6.57143 0L9.42857 0C9.69471 0 9.95718 0.0609948 10.1952 0.178154C10.4333 0.295313 10.6403 0.465419 10.8 0.675L12 2.25H15.7143C15.7901 2.25 15.8627 2.27963 15.9163 2.33238C15.9699 2.38512 16 2.45666 16 2.53125V3.09375C16 3.16834 15.9699 3.23988 15.9163 3.29262C15.8627 3.34537 15.7901 3.375 15.7143 3.375H15.0393L13.8536 16.4637C13.8152 16.8833 13.6188 17.2737 13.3029 17.558C12.987 17.8423 12.5745 17.9999 12.1464 18H3.85357C3.42554 17.9999 3.01302 17.8423 2.69711 17.558C2.38121 17.2737 2.18477 16.8833 2.14643 16.4637L0.960713 3.375H0.285713C0.209937 3.375 0.137264 3.34537 0.083683 3.29262C0.0301008 3.23988 0 3.16834 0 3.09375V2.53125C0 2.45666 0.0301008 2.38512 0.083683 2.33238C0.137264 2.27963 0.209937 2.25 0.285713 2.25ZM9.88571 1.35C9.8323 1.28034 9.76324 1.22379 9.68393 1.18475C9.60463 1.14572 9.51723 1.12527 9.42857 1.125H6.57143C6.48277 1.12527 6.39537 1.14572 6.31606 1.18475C6.23676 1.22379 6.1677 1.28034 6.11429 1.35L5.42857 2.25H10.5714L9.88571 1.35ZM3.28571 16.3617C3.29748 16.5019 3.36245 16.6325 3.46768 16.7277C3.57292 16.8228 3.7107 16.8754 3.85357 16.875H12.1464C12.2893 16.8754 12.4271 16.8228 12.5323 16.7277C12.6376 16.6325 12.7025 16.5019 12.7143 16.3617L13.8929 3.375H2.10714L3.28571 16.3617Z" fill="#FEAF00" />
                        </svg>
                    </button>
                    <button className="actions view" onClick={handleViewRequest}>
                        <svg width="25" height="15" viewBox="0 0 25 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5002 8.6875C13.2369 8.6875 13.9435 8.43728 14.4644 7.99188C14.9853 7.54648 15.278 6.94239 15.278 6.3125C15.278 5.68261 14.9853 5.07852 14.4644 4.63312C13.9435 4.18772 13.2369 3.9375 12.5002 3.9375C12.4568 3.9375 12.4186 3.94641 12.3765 3.94826C12.5104 4.26344 12.5363 4.60472 12.4513 4.93206C12.3663 5.25939 12.1738 5.55921 11.8965 5.79631C11.6192 6.03341 11.2685 6.19796 10.8857 6.27066C10.5028 6.34336 10.1037 6.32118 9.73503 6.20674C9.73503 6.24385 9.72244 6.2765 9.72244 6.3125C9.72244 6.62439 9.79429 6.93323 9.93389 7.22137C10.0735 7.50952 10.2781 7.77134 10.536 7.99188C11.057 8.43728 11.7635 8.6875 12.5002 8.6875ZM24.8492 6.9582C22.4954 3.03166 17.8357 0.375 12.5002 0.375C7.16472 0.375 2.50369 3.03352 0.151262 6.95857C0.0519747 7.1265 0.000244141 7.31202 0.000244141 7.50019C0.000244141 7.68835 0.0519747 7.87387 0.151262 8.0418C2.50499 11.9683 7.16472 14.625 12.5002 14.625C17.8357 14.625 22.4967 11.9665 24.8492 8.04143C24.9485 7.8735 25.0002 7.68798 25.0002 7.49981C25.0002 7.31165 24.9485 7.12613 24.8492 6.9582ZM12.5002 1.5625C13.599 1.5625 14.6731 1.84108 15.5867 2.36302C16.5003 2.88496 17.2124 3.6268 17.6329 4.49475C18.0534 5.3627 18.1634 6.31777 17.949 7.23918C17.7347 8.16059 17.2055 9.00696 16.4286 9.67126C15.6516 10.3356 14.6617 10.788 13.5841 10.9712C12.5064 11.1545 11.3893 11.0604 10.3742 10.7009C9.35906 10.3414 8.4914 9.73259 7.88094 8.95146C7.27049 8.17032 6.94466 7.25196 6.94466 6.3125C6.94627 5.05314 7.5321 3.84576 8.57362 2.95526C9.61514 2.06476 11.0273 1.56388 12.5002 1.5625ZM12.5002 13.4375C7.8405 13.4375 3.58269 11.1623 1.38911 7.5C2.6228 5.42926 4.59574 3.74825 7.02192 2.70064C6.11611 3.70334 5.55578 4.94576 5.55578 6.3125C5.55578 7.88722 6.28742 9.39745 7.58976 10.5109C8.89209 11.6244 10.6584 12.25 12.5002 12.25C14.342 12.25 16.1083 11.6244 17.4107 10.5109C18.713 9.39745 19.4447 7.88722 19.4447 6.3125C19.4447 4.94576 18.8843 3.70334 17.9785 2.70064C20.4047 3.74825 22.3776 5.42926 23.6113 7.5C21.4182 11.1623 17.1599 13.4375 12.5002 13.4375Z" fill="#FEAF00" />
                        </svg>
                    </button>
                </td>

                <RequestUpdate
                    data={data}
                    showUpdate={showUpdate}
                    setShowUpdate={setShowUpdate}
                    setRerenderCounter={setRerenderCounter}
                    rerenderCounter={rerenderCounter}
                />
                <RequestView
                    id={data.equipment_materials_id}
                    data={singleRequest}
                    viewSingle={viewSingle}
                    setViewSingle={setViewSingle}
                    monoblock_single={data.material[data.equipment_materials_id].monoblock_single}
                    microphones={data.material[data.equipment_materials_id].microphones}
                    armchairs={data.material[data.equipment_materials_id].armchairs}
                    speakers={data.material[data.equipment_materials_id].speakers}
                    whiteboard={data.material[data.equipment_materials_id].whiteboard}
                    tables={data.material[data.equipment_materials_id].tables}
                />
                <td style={{ display: data?.status === 'pending' ? 'flex' : 'none' }}>
                    <button style={{
                        backgroundColor: 'green',
                        margin: '10px',
                        color: '#fff',
                        padding: '5px 10px',
                        border: 'none',
                        cursor: 'pointer'
                    }} onClick={handleApprove}><FontAwesomeIcon icon={faCheck} /> {/* check icon */}</button>
                    <button style={{
                        backgroundColor: 'red',
                        margin: '10px',
                        color: '#fff',
                        padding: '5px 10px',
                        border: 'none',
                        cursor: 'pointer'
                    }} onClick={handleReject}><FontAwesomeIcon icon={faTimes} /> {/* x icon */}</button>
                </td>
            </tr>
        </>
    )
}

export default UserRequest