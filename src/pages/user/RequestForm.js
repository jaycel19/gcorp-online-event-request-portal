import React, { useState } from 'react';
import RequestFormMessage from '../../components/RequestFormMessage';
import '../../css/RequestForm.css';
import useInsertRequest from '../../components/useInsertRequest';
import axios from 'axios';
import EmptyAlert from '../../components/EmptyAlert';
import { useAuthContext } from '../../context/AuthContext';

const RequestForm = () => {
    const { loggedUser } = useAuthContext();
    const [requestData, setRequestData] = useState({
        user_id: loggedUser.id,
        facility: '',
        title_event: '',
        user_name: '',
        department: '',
        contact_number: '',
        type_of_event: '',
        duration_from: '',
        duration_from_time: '',
        duration_to: '',
        duration_to_time: '',
        description_of_activity: '',
        equipment_materials_id: 0,
        open_to_the_public: false,
        expected_num_attend_gc: '',
        expected_num_attend_out: '',
        cater: false,
        cater_open_public: false,
        additional_info: '',
    }
    );

    const [materialData, setMaterialData] = useState({
        request_id: 0,
        monoblock_single: 0,
        armchairs: 0,
        microphones: 0,
        speakers: 0,
        whiteboard: 0,
        tables: 0,
    })
    const [toSubmit, setToSubmit] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const useInsertRequestMutation = useInsertRequest();

    const handleShowModal = () => {
        const {
            facility,
            title_event,
            user_name,
            department,
            contact_number,
            type_of_event,
            duration_from,
            duration_from_time,
            duration_to,
            duration_to_time,
            description_of_activity,
            expected_num_attend_gc,
            expected_num_attend_out,
            additional_info
        } = requestData;

        if (!facility && !title_event && !user_name && !department
            && !contact_number && !type_of_event && !duration_from
            && !duration_from_time && !duration_to && !duration_to_time
            && !description_of_activity && !expected_num_attend_gc && !expected_num_attend_out
            && !additional_info) {

            setIsEmpty(true);

        } else {
            setToSubmit(true);
        }

    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post('https://capstone23.com/gcorp/gcorp-backend/api/material/insert.php', materialData);
            const matResData = response.data;
            const matId = parseInt(matResData.material_id);

            if (response.data) {
                const updatedRequestData = { ...requestData, equipment_materials_id: matId };
                await useInsertRequestMutation.mutateAsync(updatedRequestData);
            }


            setRequestData({
                facility: '',
                title_event: '',
                user_name: '',
                department: '',
                contact_number: '',
                type_of_event: '',
                duration_from: '',
                duration_from_time: '',
                duration_to: '',
                duration_to_time: '',
                description_of_activity: '',
                equipment_materials_id: 0,
                open_to_the_public: false,
                expected_num_attend_gc: '',
                expected_num_attend_out: '',
                cater: false,
                cater_open_public: false,
                additional_info: '',
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setRequestData((prevData) => ({ ...prevData, [name]: newValue }));
    }

    const handleCheckboxChange = (e) => {
        const { name, checked, value } = e.target;
        if (name === "cater_open_public" || name === "cater" || name === "open_to_the_public") {
            setRequestData((prevData) => ({ ...prevData, [name]: checked }));
        } else {
            const newValue = checked === true && value;
            setRequestData((prevData) => ({ ...prevData, [name]: newValue }));
        }
    }

    const handleMaterialInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setMaterialData((prevData) => ({ ...prevData, [name]: newValue }));
    }

    const handleMaterialCheckboxChange = (e) => {
        const checkboxName = e.target.name;
        const inputField = document.getElementsByName(checkboxName)[1];
        inputField.disabled = !e.target.checked;
    }
    return (
        <div className="RequestForm">
            <div className="title">
                <h2>REQUEST FORM FOR USE OF GC FACILITIES</h2>
            </div>
            <div className="first">
                <div className="titleHead">
                    <p>Please indicate the specific facility to use by checking the box:</p>
                </div>
                <div className="facilityList">
                    <input type="checkbox" name="facility" value="Function Hall" onChange={handleCheckboxChange} />
                    <span>FUNCTION HALL</span>
                    <input type="checkbox" name="facility" value="P.E ROOM" onChange={handleCheckboxChange} />
                    <span>P.E ROOM</span>
                    <input type="checkbox" name="facility" value="OTHER" onChange={handleCheckboxChange} />
                    <span>OTHER: </span>
                    <input className="" style={{ backgroundColor: "#fff", borderBottom: "1px solid #000", padding: "5px", width: '100%', maxWidth: '15%' }} type="text" name="facility" value={requestData.facility} onChange={handleInputChange} />
                </div>
                <div className="eventInfo">
                    <div className="info">
                        <p>TITLE OF EVENT:</p>
                        <input type="text" name="title_event" value={requestData.title_event} onChange={handleInputChange} />
                    </div>
                    <div className="info">
                        <p>REQUESTOR'S FULL NAME:</p>
                        <input type="text" name="user_name" value={requestData.user_name} onChange={handleInputChange} />
                    </div>
                    <div className="info">
                        <p>DEPARTMENT:</p>
                        <input type="text" name="department" value={requestData.department} onChange={handleInputChange} />
                    </div>
                    <div className="info">
                        <p>CONTACT NUMBER:</p>
                        <input type="text" name="contact_number" value={requestData.contact_number} onChange={handleInputChange} />
                    </div>
                    <div className="info">
                        <p>TYPE OF EVENT:</p>
                        <select value={requestData.type_of_event} name="type_of_event" onChange={handleInputChange}>
                            <option value="Conference">Conference</option>
                            <option value="Training">Training</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Forum">Forum</option>
                            <option value="Colloquium">Colloquium</option>
                            <option value="Orientation">Orientation</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="second">
                <div className="duration">
                    <div className="header">
                        <p>EVENT/ACTIVITY DURATION:</p>
                        <div className="from">
                            <h3>FROM</h3>
                        </div>
                    </div>
                    <div className="fromTO">
                        <div className="item">
                            <div className="singleItem">
                                <div className="singleDate">
                                    <p>DATE:</p>
                                    <input type="date" name="duration_from" value={requestData.duration_from} onChange={handleInputChange} />
                                </div>
                                <div className="singleDate">
                                    <p>TIME:</p>
                                    <input type="time" name="duration_from_time" value={requestData.duration_from_time} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="to">
                            <h3>TO</h3>
                        </div>
                        <div className="item">
                            <div className="singleItem">
                                <div className="singleDate">
                                    <p>DATE:</p>
                                    <input type="date" name="duration_to" value={requestData.duration_to} onChange={handleInputChange} />
                                </div>
                                <div className="singleDate">
                                    <p>TIME:</p>
                                    <input type="time" name="duration_to_time" value={requestData.duration_to_time} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="descriptionAct">
                    <p>DESCRIPTION OF ACTIVITY:</p>
                    <textarea name="description_of_activity" value={requestData.description_of_activity} onChange={handleInputChange}>

                    </textarea>
                </div>
            </div>
            <div className="third">
                <div className="equipTitle">
                    <h3>EQUIPMENT/MATERIALS NEEDED:</h3>
                </div>
                <div className="equipQuan">
                    <div className="checkQuan">
                        <div className="everyItem">
                            <div className="nthItems">
                                <input type="checkbox" name="monoblock_single" onChange={handleMaterialCheckboxChange} />
                                <p>Single Monoblock Chair</p>
                            </div>
                            <input type="number" max="150" min="0" name="monoblock_single" step="1" value={materialData.monoblock_single} onChange={handleMaterialInputChange} disabled={true} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                        <div className="everyItem">
                            <div className="nthItems">
                                <input type="checkbox" name="armchairs" onChange={handleMaterialCheckboxChange} />
                                <p>Armchairs</p>
                            </div>
                            <input type="number" max="150" min="0" name="armchairs" value={materialData.armchairs} onChange={handleMaterialInputChange} disabled={true} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                        <div className="everyItem">
                            <div className="nthItems">
                                <input type="checkbox" name="tables" onChange={handleMaterialCheckboxChange} />
                                <p>Tables</p>
                            </div>
                            <input type="number" max="6" min="0" name="tables" value={materialData.tables} onChange={handleMaterialInputChange} disabled={true} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                        <div className="everyItem">
                            <div className="nthItems">
                                <input type="checkbox" name="microphones" onChange={handleMaterialCheckboxChange} />
                                <p>Microphones</p>
                            </div>
                            <input type="number" max="2" min="0" name="microphones" value={materialData.microphones} onChange={handleMaterialInputChange} disabled={true} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                        <div className="everyItem">
                            <div className="nthItems">
                                <input type="checkbox" name="speakers" onChange={handleMaterialCheckboxChange} />
                                <p>Speakers</p>
                            </div>
                            <input type="number" max="2" min="0" name="speakers" value={materialData.speakers} onChange={handleMaterialInputChange} disabled={true} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                        <div className="everyItem">
                            <div className="nthItems">
                                <input type="checkbox" name="whiteboard" onChange={handleMaterialCheckboxChange} />
                                <p>Whiteboard</p>
                            </div>
                            <input type="number" max="1" min="0" name="whiteboard" value={materialData.whiteboard} onChange={handleMaterialInputChange} disabled={true} inputMode="numeric" pattern="[0-9]*" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="fourth">
                <div className="otherSpec">
                    <h3>OTHER SPECIFICATIONS:</h3>
                </div>
                <div className="pubOpen">
                    <p>Open to the public?</p>
                    <div className="opItem">
                        <p>Yes</p>
                        <input type="checkbox" name="open_to_the_public" value={true} onChange={handleCheckboxChange} />
                    </div>
                    <div className="opItem">
                        <p>No</p>
                        <input type="checkbox" name="open_to_the_public" value={false} onChnage={handleCheckboxChange} />
                    </div>
                </div>
                <div className="otherSpec">
                    <div className="attendGc">
                        <div className="attendP">
                            <p>Expected Number of Attedees</p>
                            <p>From Gordon College:</p>
                        </div>
                        <textarea value={requestData.expected_num_attend_gc} name="expected_num_attend_gc" onChange={handleInputChange}>

                        </textarea>
                    </div>
                </div>
                <div className="otherSpec">
                    <div className="attendGc">
                        <div className="attendP">
                            <p>Expected Number of Attedees</p>
                            <p>Outside of Gordon College:</p>
                        </div>
                        <textarea name="expected_num_attend_out" value={requestData.expected_num_attend_out} onChange={handleInputChange}>

                        </textarea>
                    </div>
                </div>
                <div className="otherSpec">
                    <div className="caterItem">
                        <p>With Food Catering?</p>
                        <div className="right">
                            <div className="foodItem">
                                <p>Yes</p>
                                <input type="checkbox" name="cater" value={true} onChange={handleCheckboxChange} />
                            </div>
                            <div className="foodItem">
                                <p>No</p>
                                <input type="checkbox" name="cater" value={false} onChange={handleCheckboxChange} />
                            </div>
                        </div>
                    </div>
                    <div className="caterFood">
                        <p className="public">
                            <span>Open to the public?</span>
                            {/*
                            <span className="many">
                                <span>How many:</span>
                                <input style={{ backgroundColor: "#fff", borderBottom: "1px solid #000", width: "55px" }} type="text" />
                            </span>*/}
                        </p>
                        <div className="cateRight">
                            <div className="foodItem">
                                <p>Yes</p>
                                <input type="checkbox" name="cater_open_public" value={true} onChange={handleCheckboxChange} />
                            </div>
                            <div className="foodItem">
                                <p>No</p>
                                <input type="checkbox" name="cater_open_public" value={false} onChange={handleCheckboxChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="addInfo">
                    <div className="disc">
                        <h3>Additional Information:</h3>
                        <p>IF THERE ARE GUEST SPEAKERS OR VIP VISITORS PLEASE WRITE THEIR NAMES BELOW TO NOTIFY THE SECURITY:</p>
                        <textarea name="additional_info" value={requestData.additional_info} onChange={handleInputChange}>

                        </textarea>
                        <div className="subBtn">
                            <button type="submit" onClick={handleShowModal}>SUBMIT REQUEST <br />FORM</button>
                        </div>
                    </div>
                </div>
            </div>
            <EmptyAlert isEmpty={isEmpty} setIsEmpty={setIsEmpty} />
            {toSubmit && <RequestFormMessage setToSubmit={setToSubmit} toSubmit={toSubmit} handleSubmit={handleSubmit} />}
        </div>
    )
}

export default RequestForm