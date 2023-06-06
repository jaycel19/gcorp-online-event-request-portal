import React, { useEffect, useState } from "react";
import "../css/RequestUpdate.css";
import axios from "axios";
import Swal from "sweetalert2";

import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const RequestUpdate = ({
  data,
  setShowUpdate,
  showUpdate,
  setRerenderCounter,
  rerenderCounter,
  defaultRequestDate,
}) => {
  const [requestData, setRequestData] = useState({});
  const [isAttendIsEqual, setIsAttendIsEqual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestDatas, setRequestDatas] = useState({});
  console.log(requestData);
  useEffect(() => {
    const getSingleRequest = async () => {
      try {
        const response = await axios.get(
          `https://capstone23.com/gcorp/gcorp-backend/api/request/single.php?id=${data.id}`
        );
        setRequestData(response.data[data.id]);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    };
    getSingleRequest();
  }, [rerenderCounter]);

  useEffect(() => {
    setRequestData((prev) => ({
      ...prev,
      duration_from: defaultRequestDate.duration_from,
      duration_to: defaultRequestDate.duration_to,
    }));
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
  }, [rerenderCounter]);

  const [materialData, setMaterialData] = useState({
    id: data.equipment_materials_id,
    monoblock_single:
      data.material[data.equipment_materials_id].monoblock_single,
    armchairs: data.material[data.equipment_materials_id].armchairs,
    microphones: data.material[data.equipment_materials_id].microphones,
    speakers: data.material[data.equipment_materials_id].speakers,
    whiteboard: data.material[data.equipment_materials_id].whiteboard,
    tables: data.material[data.equipment_materials_id].tables,
  });

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

  const updateRequest = async (requestData) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "https://capstone23.com/gcorp/gcorp-backend/api/request/update.php",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRerenderCounter(!rerenderCounter);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateMaterial = async (materialData) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "https://capstone23.com/gcorp/gcorp-backend/api/material/update.php",
        materialData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRerenderCounter(!rerenderCounter);
      setMaterialData({
        id: data.equipment_materials_id,
        monoblock_single:
          data.material[data.equipment_materials_id].monoblock_single,
        armchairs: data.material[data.equipment_materials_id].armchairs,
        microphones: data.material[data.equipment_materials_id].microphones,
        speakers: data.material[data.equipment_materials_id].speakers,
        whiteboard: data.material[data.equipment_materials_id].whiteboard,
        tables: data.material[data.equipment_materials_id].tables,
      });
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRequest(requestData);
        updateMaterial(materialData);
        setShowUpdate(false);
      }
    });
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
          : parseInt(requestData.monoblock_single);
      const attendSum = parseInt(attendOut) + parseInt(attendGc);
      setIsAttendIsEqual(attendSum === monoblock);
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

      if (fromDate > toDate) {
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

  console.log(requestData.open_to_the_public);

  const handleMaterialInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setMaterialData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const handleMaterialCheckboxChange = (e) => {
    const checkboxName = e.target.name;
    const inputField = document.getElementsByName(checkboxName)[1];
    inputField.disabled = !e.target.checked;
  };

  return (
    <div
      className="RequestUpdate"
      style={{ display: `${showUpdate ? "flex" : "none"}`, zIndex: "10" }}
    >
      <div
        className="modal-content-update"
        style={{
          borderLeft: "10px solid #3f51b5",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              border: "none",
              backgroundColor: "#fff",
              fontWeight: "1000",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={() => setShowUpdate(false)}
          >
            X
          </button>
        </div>

        <div className="title">
          <h2>REQUEST FORM FOR USE OF GC FACILITIES UPDATE</h2>
        </div>
        <div className="first">
          <div className="titleHead">
            <p>
              Please indicate the specific facility to use by checking the box:
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
              className="other"
              style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #000",
                padding: "5px",
              }}
              type="text"
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
                style={{ width: "180px" }}
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
              <span>Conference</span>
              <input
                type="checkbox"
                name="type_of_event"
                value="Training"
                onChange={handleCheckboxChange}
              />
              <span>Training</span>
              <input
                type="checkbox"
                name="type_of_event"
                value="Seminar"
                onChange={handleCheckboxChange}
              />
              <span>Seminar</span>
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
              style={{
                width: '25%',
                padding: '10px'
              }}
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
            <div className="quan">
              <h3>QUANTITY</h3>
            </div>
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
                  style={{
                    width: "50px",
                  }}
                  type="number"
                  name="monoblock_single"
                  value={materialData.monoblock_single}
                  onChange={handleInputChange}
                  disabled={true}
                  inputMode="numeric"
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
                  style={{
                    width: "50px",
                  }}
                  type="number"
                  name="armchairs"
                  value={materialData.armchairs}
                  onChange={handleInputChange}
                  disabled={true}
                  inputMode="numeric"
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
                  style={{
                    width: "50px",
                  }}
                  type="number"
                  name="tables"
                  value={materialData.tables}
                  onChange={handleInputChange}
                  disabled={true}
                  inputMode="numeric"
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
                  style={{
                    width: "50px",
                  }}
                  type="number"
                  max="2"
                  name="microphones"
                  value={materialData.microphones}
                  onChange={handleInputChange}
                  disabled={true}
                  inputMode="numeric"
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
                  style={{
                    width: "50px",
                  }}
                  type="number"
                  name="speakers"
                  value={materialData.speakers}
                  onChange={handleInputChange}
                  disabled={true}
                  inputMode="numeric"
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
                  style={{
                    width: "50px",
                  }}
                  type="number"
                  name="whiteboard"
                  value={materialData.whiteboard}
                  onChange={handleInputChange}
                  disabled={true}
                  inputMode="numeric"
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
            <div className="opItem">
              <p>Yes</p>
              <input
                type="checkbox"
                name="open_to_the_public"
                value={1}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className="opItem">
              <p>No</p>
              <input
                type="checkbox"
                name="open_to_the_public"
                value={0}
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
                    The monoblocks and attendees does not match
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
                    value={1}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="foodItem">
                  <p>No</p>
                  <input
                    type="checkbox"
                    name="cater"
                    value={0}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>
            <div className="caterFood">
              <div className="cateRight"></div>
            </div>
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
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "LOADING..." : "SUBMIT REQUEST FORM"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestUpdate;
