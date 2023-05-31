import React, { useEffect, useState } from "react";
import "../../css/RequestForm.css";
import useInsertRequest from "../../components/useInsertRequest";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const RequestForm = () => {
  const { loggedUser } = useAuthContext();
  const [isAttendIsEqual, setIsAttendIsEqual] = useState(false);
  const [requestDatas, setRequestDatas] = useState({}); 
  const [requestData, setRequestData] = useState({
    user_id: loggedUser.id,
    facility: "",
    title_event: "",
    user_name: loggedUser.name,
    department: loggedUser.department,
    contact_number: loggedUser.userContact,
    type_of_event: "",
    duration_from: "",
    duration_from_time: "",
    duration_to: "",
    duration_to_time: "",
    description_of_activity: "",
    equipment_materials_id: 0,
    open_to_the_public: false,
    expected_num_attend_gc: 0,
    expected_num_attend_out: 0,
    cater: false,
    cater_open_public: false,
    additional_info: "",
  });

  const [materialData, setMaterialData] = useState({
    request_id: 0,
    monoblock_single: 0,
    armchairs: 0,
    microphones: 0,
    speakers: 0,
    whiteboard: 0,
    tables: 0,
  });
  const [toSubmit, setToSubmit] = useState(false);
  const useInsertRequestMutation = useInsertRequest();
  console.log(loggedUser);
  const handleCheckIfEmpty = () => {
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
      additional_info,
    } = requestData;

    if (
      !facility ||
      !title_event ||
      !user_name ||
      !department ||
      !contact_number ||
      !type_of_event ||
      !duration_from ||
      !duration_from_time ||
      !duration_to ||
      !duration_to_time ||
      !description_of_activity ||
      !expected_num_attend_gc 
    ) {
      MySwal.fire({
        title: "Empty Fields",
        text: "Please fill in all the fields.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else if (isAttendIsEqual) {
      MySwal.fire({
        title: "Monoblock not enough for the attendees",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      const hasPendingRequest = requestDatas.some(
        (request) =>
          request.user_id === loggedUser.id && request.status === "pending"
      );
      if (hasPendingRequest) {
        MySwal.fire({
          title: "Pending Request",
          text: "You already have a pending request.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        MySwal.fire({
          title: "Confirmation",
          text: "Are you sure you want to submit the request?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            MySwal.fire({
              title: "Request Submitted",
              text: "Kindly wait for the approval of the admin.",
              icon: "success",
              confirmButtonText: "OK",
            });
            handleSubmit();
          }
        });
      }
    }
  };

  useEffect(() => {
    const getRequests = async () => {
      try {
        const response = await axios.get(
          `https://capstone23.com/gcorp/gcorp-backend/api/request/requests.php`
        );
        const requestDataIds = Object.keys(response.data);
        const reconstructedRequestDatas = requestDataIds.map(
          (id) => response.data[id]
        );

        setRequestDatas(reconstructedRequestDatas);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };
    getRequests();
  }, []);

  const isDateReserved = (date) => {
    for (const requestData of requestDatas) {
      if (
        date >= requestData.duration_from &&
        date <= requestData.duration_to
      ) {
        return true;
      }
    }
    return false;
  };

  console.log(requestDatas);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://capstone23.com/gcorp/gcorp-backend/api/material/insert.php",
        materialData
      );
      const matResData = response.data;
      const matId = parseInt(matResData.material_id);

      if (response.data) {
        const updatedRequestData = {
          ...requestData,
          equipment_materials_id: matId,
        };
        await useInsertRequestMutation.mutateAsync(updatedRequestData);
      }

      setRequestData({
        facility: "",
        title_event: "",
        user_name: "",
        department: "",
        contact_number: "",
        type_of_event: "",
        duration_from: "",
        duration_from_time: "",
        duration_to: "",
        duration_to_time: "",
        description_of_activity: "",
        equipment_materials_id: 0,
        open_to_the_public: false,
        expected_num_attend_gc: "",
        expected_num_attend_out: "",
        cater: false,
        cater_open_public: false,
        additional_info: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setRequestData((prevData) => ({ ...prevData, [name]: newValue }));
    const newValueMat = type === "checkbox" ? checked : value;
    setMaterialData((prevData) => ({ ...prevData, [name]: newValueMat }));

    if (
      name === "expected_num_attend_out" ||
      name === "expected_num_attend_gc" ||
      name === "monoblock_single"
    ) {
      const attendGc =
        name === "expected_num_attend_gc"
          ? parseInt(newValue)
          : requestData.expected_num_attend_gc;
      const attendOut =
        name === "expected_num_attend_out"
          ? parseInt(newValue)
          : requestData.expected_num_attend_out;
      const monoblock =
        name === "monoblock_single"
          ? parseInt(newValue)
          : requestData.monoblock_single;
      const attendSum = parseInt(attendOut) + parseInt(attendGc);
      setIsAttendIsEqual(attendSum > monoblock);
    }

    if (name === "duration_from" || name === "duration_to") {
      const fromDate =
        name === "duration_from"
          ? new Date(newValue)
          : new Date(requestData.duration_from);
      const toDate =
        name === "duration_to"
          ? new Date(newValue)
          : new Date(requestData.duration_to);

      if (toDate < fromDate) {
        MySwal.fire({
          title: "Invalid Date Range",
          text: "The 'To' date cannot be earlier than the 'From' date.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          setRequestData((prevData) => ({ ...prevData, [name]: "" }));
        });
      }

      const currentDate = new Date();
      if (fromDate < currentDate || toDate < currentDate) {
        MySwal.fire({
          title: "Invalid Date",
          text: "You cannot choose a date that is before the current date.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          setRequestData((prevData) => ({ ...prevData, [name]: "" }));
        });
      }

      if (isDateReserved(newValue)) {
        MySwal.fire({
          title: "Date Reserved",
          text: "Please pick another date.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          setRequestData((prevData) => ({ ...prevData, [name]: "" }));
        });
      }
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;
    if (
      name === "cater_open_public" ||
      name === "cater" ||
      name === "open_to_the_public"
    ) {
      setRequestData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      const newValue = checked === true && value;
      setRequestData((prevData) => ({ ...prevData, [name]: newValue }));
    }
  };

  const handleMaterialInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  };

  const handleMaterialCheckboxChange = (e) => {
    const checkboxName = e.target.name;
    const inputField = document.getElementsByName(checkboxName)[1];
    inputField.disabled = !e.target.checked;
  };

  return (
    <div className="RequestForm">
      <div className="title">
        <h2>REQUEST FORM FOR USE OF GC FACILITIES</h2>
      </div>
      <div className="first">
        <div className="titleHead">
          <p>
            PLEASE INDICATE THE SPECIFIC FACILITY TO USE BY CHECKING THE BOX:
          </p>
        </div>
        <div className="facilityList">
          <input
            type="checkbox"
            name="facility"
            value="Function Hall"
            onChange={handleCheckboxChange}
          />
          <span>FUNCTION HALL</span>
          <input
            type="checkbox"
            name="facility"
            value="P.E ROOM"
            onChange={handleCheckboxChange}
          />
          <span>P.E ROOM</span>
          <input
            type="checkbox"
            name="facility"
            value="OTHER"
            onChange={handleCheckboxChange}
          />
          <span>OTHER: </span>
          <input
            className=""
            style={{
              backgroundColor: "#fff",
              borderBottom: "1px solid #000",
              padding: "5px",
              width: "100%",
              maxWidth: "15%",
            }}
            type="text"
            name="facility"
            value={requestData.facility}
            onChange={handleInputChange}
          />
        </div>
        <div className="eventInfo">
          <div className="info">
            <p>TITLE OF EVENT:</p>
            <input
              type="text"
              name="title_event"
              value={requestData.title_event}
              onChange={handleInputChange}
            />
          </div>
          <div className="info">
            <p>REQUESTOR'S FULL NAME:</p>
            <input
              type="text"
              name="user_name"
              value={requestData.user_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="info">
            <p>DEPARTMENT:</p>
            <select
              className="deps"
              style={{ width: "175px" }}
              value={requestData.department}
              onChange={handleInputChange}
              name="department"
            >
              <option value="CBA">CBA</option>
              <option value="CCS">CCS</option>
              <option value="CEAS">CEAS</option>
              <option value="CHTM">CHTM</option>
              <option value="CAHS">CAHS</option>
            </select>
          </div>
          <div className="info">
            <p>CONTACT NUMBER:</p>
            <input
              type="text"
              name="contact_number"
              value={requestData.contact_number}
              onChange={handleInputChange}
            />
          </div>
          <div className="info">
            <p>TYPE OF EVENT:</p>
            <input
              type="checkbox"
              name="type_of_event"
              value="Conference"
              onChange={handleCheckboxChange}
            />
            <span>CONFERENCE</span>
            <input
              type="checkbox"
              name="type_of_event"
              value="Training"
              onChange={handleCheckboxChange}
            />
            <span>TRAINING</span>
            <input
              type="checkbox"
              name="type_of_event"
              value="Seminar"
              onChange={handleCheckboxChange}
            />
            <span>SEMINAR</span>
            <input
              type="checkbox"
              name="type_of_event"
              value="OTHER"
              onChange={handleCheckboxChange}
            />
            <span>OTHER: </span>
            <input
              className=""
              style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #000",
                padding: "5px",
                width: "100%",
                maxWidth: "15%",
              }}
              type="text"
              name="type_of_event"
              value={requestData.type_of_event}
              onChange={handleInputChange}
            />
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
                  <input
                    type="date"
                    name="duration_from"
                    value={requestData.duration_from}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="singleDate">
                  <p>TIME:</p>

                  <select
                    value={requestData.duration_from_time}
                    name="duration_from_time"
                    onChange={handleInputChange}
                  >
                    <option value="7:00 AM">7:00 AM</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                  </select>
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
                  <input
                    type="date"
                    name="duration_to"
                    value={requestData.duration_to}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="singleDate">
                  <p>TIME:</p>
                  <select
                    value={requestData.duration_to_time}
                    name="duration_to_time"
                    onChange={handleInputChange}
                  >
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                    <option value="9:00 PM">9:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="descriptionAct">
          <p>DESCRIPTION OF ACTIVITY:</p>
          <textarea
            name="description_of_activity"
            value={requestData.description_of_activity}
            onChange={handleInputChange}
          ></textarea>
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
                <input
                  type="checkbox"
                  name="monoblock_single"
                  onChange={handleMaterialCheckboxChange}
                />
                <p>Single Monoblock Chair</p>
              </div>
              <input
                type="number"
                max="150"
                min="0"
                name="monoblock_single"
                step="1"
                value={materialData.monoblock_single}
                onChange={handleInputChange}
                disabled={true}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="everyItem">
              <div className="nthItems">
                <input
                  type="checkbox"
                  name="armchairs"
                  onChange={handleMaterialCheckboxChange}
                />
                <p>Armchairs</p>
              </div>
              <input
                type="number"
                max="150"
                min="0"
                name="armchairs"
                value={materialData.armchairs}
                onChange={handleInputChange}
                disabled={true}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="everyItem">
              <div className="nthItems">
                <input
                  type="checkbox"
                  name="tables"
                  onChange={handleMaterialCheckboxChange}
                />
                <p>Tables</p>
              </div>
              <input
                style={{ width: "50px" }}
                type="number"
                max="6"
                min="0"
                name="tables"
                value={materialData.tables}
                onChange={handleInputChange}
                disabled={true}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="everyItem">
              <div className="nthItems">
                <input
                  type="checkbox"
                  name="microphones"
                  onChange={handleMaterialCheckboxChange}
                />
                <p>Microphones</p>
              </div>
              <input
                style={{ width: "50px" }}
                type="number"
                max="2"
                min="0"
                name="microphones"
                value={materialData.microphones}
                onChange={handleInputChange}
                disabled={true}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="everyItem">
              <div className="nthItems">
                <input
                  type="checkbox"
                  name="speakers"
                  onChange={handleMaterialCheckboxChange}
                />
                <p>Speakers</p>
              </div>
              <input
                style={{ width: "50px" }}
                type="number"
                max="2"
                min="0"
                name="speakers"
                value={materialData.speakers}
                onChange={handleInputChange}
                disabled={true}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <div className="everyItem">
              <div className="nthItems">
                <input
                  type="checkbox"
                  name="whiteboard"
                  onChange={handleMaterialCheckboxChange}
                />
                <p>Whiteboard</p>
              </div>
              <input
                style={{ width: "50px" }}
                type="number"
                max="1"
                min="0"
                name="whiteboard"
                value={materialData.whiteboard}
                onChange={handleInputChange}
                disabled={true}
                inputMode="numeric"
                pattern="[0-9]*"
              />
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
          <div className="opItem" style={{ marginLeft: "21%" }}>
            <p>Yes</p>
            <input
              type="checkbox"
              name="open_to_the_public"
              value={true}
              onChange={handleCheckboxChange}
            />
          </div>
          <div className="opItem">
            <p>No</p>
            <input
              type="checkbox"
              name="open_to_the_public"
              value={false}
              onChnage={handleCheckboxChange}
            />
          </div>
        </div>
        <div className="otherSpec">
          <div className="attendGc">
            <div className="attendP">
              <p>Expected Number of Attedees</p>
              <p>From Gordon College:</p>
            </div>
            <div
              style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              {isAttendIsEqual && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "red",
                  }}
                >
                  You are short in Monoblocks
                </span>
              )}
              <input
                style={{
                  width: "23%",
                }}
                type="number"
                value={requestData.expected_num_attend_gc}
                name="expected_num_attend_gc"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="otherSpec">
          <div className="attendGc">
            <div className="attendP">
              <p>Expected Number of Attedees</p>
              <p>Outside of Gordon College:</p>
            </div>
            <div
              style={{
                width: "200px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <input
                style={{
                  width: "23%",
                }}
                type="number"
                name="expected_num_attend_out"
                value={requestData.expected_num_attend_out}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="otherSpec">
          <div className="caterItem">
            <p>With Food Catering?</p>
            <div className="right">
              <div className="foodItem">
                <p>Yes</p>
                <input
                  type="checkbox"
                  name="cater"
                  value={true}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="foodItem">
                <p>No</p>
                <input
                  type="checkbox"
                  name="cater"
                  value={false}
                  onChange={handleCheckboxChange}
                />
              </div>
            </div>
          </div>
          <div className="caterFood"></div>
        </div>
        <div className="addInfo">
          <div className="disc">
            <h3>Additional Information:</h3>
            <p>
              IF THERE ARE GUEST SPEAKERS OR VIP VISITORS PLEASE WRITE THEIR
              NAMES BELOW TO NOTIFY THE SECURITY:
            </p>
            <textarea
              name="additional_info"
              value={requestData.additional_info}
              onChange={handleInputChange}
            ></textarea>
            <div className="subBtn">
              <button type="submit" onClick={handleCheckIfEmpty}>
                SUBMIT REQUEST <br />
                FORM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
