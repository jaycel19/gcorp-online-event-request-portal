import React, { useEffect, useState } from "react";
import "../css/RequestUpdate.css";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const UserRequestUpdate = ({
  data,
  setData,
  setShowUpdate,
  showUpdate,
  setRerenderCounter,
  rerenderCounter,
  defaultRequestDate,
  materialData,
  setMaterialData,
}) => {
  const [requestDatas, setRequestDatas] = useState({});
  const [currentClass, setCurrentClass] = useState(1);
  const classCount = 4;
  const [isLoading, setIsLoading] = useState(false);
  const [isAttendIsEqual, setIsAttendIsEqual] = useState(false);
  const [toSubmit, setToSubmit] = useState(false);
  const [equipmentLimit, setEquipmentLimit] = useState({
    name: "",
    limit: "",
    reachedLimit: false,
  });
  const [formPagination, setFormPagination] = useState({
    next: false,
    back: false,
  });
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
  }, [rerenderCounter]);

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

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      duration_from: defaultRequestDate.duration_from,
      duration_to: defaultRequestDate.duration_to,
    }));
    if (classCount && currentClass) {
      if (currentClass >= classCount) {
        setToSubmit(true);
        setFormPagination({ next: true });
      } else {
        setFormPagination({ next: false });
        setToSubmit(false);
      }

      if (currentClass <= 1) {
        setToSubmit(false);
        setFormPagination({ back: true });
      } else {
        setFormPagination({ back: false });
      }
    }
  }, [currentClass]);

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
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const isDateReserved = (date) => {
    for (const data of requestDatas) {
      if (date >= data.duration_from && date <= data.duration_to) {
        return true;
      }
    }
    return false;
  };

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
    } = data;

    if (
      facility === "" ||
      title_event === "" ||
      user_name === "" ||
      contact_number === "" ||
      type_of_event === "" ||
      duration_from === "" ||
      duration_from_time === "" ||
      duration_to === "" ||
      duration_to_time === ""
    ) {
      MySwal.fire({
        title: "Empty Fields",
        text: "Please fill in all the fields.",
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
        updateRequest(data);
        updateMaterial(materialData);
        setShowUpdate(false);
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setData((prevData) => ({ ...prevData, [name]: newValue }));
    const newValueMat = type === "checkbox" ? checked : value;
    setMaterialData((prevData) => ({ ...prevData, [name]: newValueMat }));

    if (name === "monoblock_single") {
      if (parseInt(value) > 150) {
        setMaterialData((prev) => ({ ...prev, monoblock_single: 0 }));
        setEquipmentLimit({
          name: "Monoblock",
          limit: "150",
          reachedLimit: true,
        });
      } else {
        setEquipmentLimit((prev) => ({ ...prev, reachedLimit: false }));
      }
    } else if (name === "tables") {
      if (parseInt(value) > 6) {
        setMaterialData((prev) => ({ ...prev, tables: 0 }));
        setEquipmentLimit({ name: "Tables", limit: "6", reachedLimit: true });
      } else {
        setEquipmentLimit((prev) => ({ ...prev, reachedLimit: false }));
      }
    } else if (name === "microphones") {
      if (parseInt(value) > 2) {
        setMaterialData((prev) => ({ ...prev, microphones: 0 }));
        setEquipmentLimit({
          name: "Microphones",
          limit: "2",
          reachedLimit: true,
        });
      } else {
        setEquipmentLimit((prev) => ({ ...prev, reachedLimit: false }));
      }
    } else if (name === "whiteboard") {
      if (parseInt(value) > 1) {
        setMaterialData((prev) => ({ ...prev, whiteboard: 0 }));
        setEquipmentLimit({
          name: "Whiteboard",
          limit: "1",
          reachedLimit: true,
        });
      } else {
        setEquipmentLimit((prev) => ({ ...prev, reachedLimit: false }));
      }
    } else if (name === "armchairs") {
      if (parseInt(value) > 50) {
        setMaterialData((prev) => ({ ...prev, armchairs: 0 }));
        setEquipmentLimit({
          name: "Armchairs",
          limit: "50",
          reachedLimit: true,
        });
      } else {
        setEquipmentLimit((prev) => ({ ...prev, reachedLimit: false }));
      }
    } else if (name === "speakers") {
      if (parseInt(value) > 2) {
        setMaterialData((prev) => ({ ...prev, speakers: 0 }));
        setEquipmentLimit({ name: "Speakers", limit: "2", reachedLimit: true });
      } else {
        setEquipmentLimit((prev) => ({ ...prev, reachedLimit: false }));
      }
    }

    if (
      name === "expected_num_attend_out" ||
      name === "expected_num_attend_gc" ||
      name === "monoblock_single"
    ) {
      const attendGc =
        name === "expected_num_attend_gc"
          ? parseInt(newValue)
          : data.expected_num_attend_gc;
      const attendOut =
        name === "expected_num_attend_out"
          ? parseInt(newValue)
          : data.expected_num_attend_out;
      const monoblock =
        name === "monoblock_single"
          ? parseInt(newValue)
          : parseInt(data.monoblock_single);
      const attendSum = parseInt(attendOut) + parseInt(attendGc);
      setIsAttendIsEqual(attendSum === monoblock);
    }

    if (name === "duration_from" || name === "duration_to") {
      const fromDate =
        name === "duration_from"
          ? new Date(newValue)
          : new Date(data.duration_from);
      const toDate =
        name === "duration_to"
          ? new Date(newValue)
          : new Date(data.duration_to);

      if (fromDate > toDate) {
        MySwal.fire({
          title: "Invalid Date Range",
          text: "The 'To' date cannot be earlier than the 'From' date.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          setData((prevData) => ({ ...prevData, [name]: "" }));
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
          setData((prevData) => ({ ...prevData, [name]: "" }));
        });
      }

      if (isDateReserved(newValue)) {
        MySwal.fire({
          title: "Date Reserved",
          text: "Please pick another date.",
          icon: "warning",
          confirmButtonText: "OK",
        }).then(() => {
          setData((prevData) => ({ ...prevData, [name]: "" }));
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
      setData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      const newValue = checked === true && value;
      setData((prevData) => ({ ...prevData, [name]: newValue }));
    }
  };
  const handleMaterialCheckboxChange = (e) => {
    const checkboxName = e.target.name;
    const inputField = document.getElementsByName(checkboxName)[1];
    inputField.disabled = !e.target.checked;
  };

  const handleNextClass = () => {
    if (currentClass < classCount) {
      setCurrentClass((prevClass) => prevClass + 1);
    }
  };

  const handleBackClass = () => {
    if (currentClass >= 1) {
      setCurrentClass((prevClass) => prevClass - 1);
    }
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
          <h2>REQUEST FORM FOR USE OF GC FACILITIES</h2>
        </div>
        {currentClass === 1 && (
          <div className="first">
            <div className="titleHead">
              <p>
                PLEASE INDICATE THE SPECIFIC FACILITY TO USE BY CHECKING THE
                BOX:
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
                value={data.facility}
                onChange={handleInputChange}
              />
            </div>
            <div className="eventInfo">
              <div className="info">
                <p>TITLE OF EVENT:</p>
                <input
                  type="text"
                  name="title_event"
                  value={data.title_event}
                  onChange={handleInputChange}
                />
              </div>
              <div className="info">
                <p>REQUESTOR'S FULL NAME:</p>
                <input
                  type="text"
                  name="user_name"
                  value={data.user_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="info">
                <p>DEPARTMENT:</p>
                <input
                  type="text"
                  className="deps"
                  style={{ width: "175px" }}
                  value={data.department}
                  onChange={handleInputChange}
                  name="department"
                />
              </div>
              <div className="info">
                <p>CONTACT NUMBER:</p>
                <input
                  type="text"
                  name="contact_number"
                  value={data.contact_number}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="info"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <p>TYPE OF EVENT:</p>
                <div className="info-inputs" style={{ width: "100%" }}>
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
                    value="Orientation"
                    onChange={handleCheckboxChange}
                  />
                  <span>ORIENTATION</span>
                  <input
                    type="checkbox"
                    name="type_of_event"
                    value="Forum"
                    onChange={handleCheckboxChange}
                  />
                  <span>FORUM</span>
                  <input
                    type="checkbox"
                    name="type_of_event"
                    value="Colloquium"
                    onChange={handleCheckboxChange}
                  />
                  <span>COLLOQUIUM</span>
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
                    value={data.type_of_event}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {currentClass === 2 && (
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
                        value={data.duration_from}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="singleDate">
                      <p>TIME:</p>

                      <select
                        value={data.duration_from_time}
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
                        value={data.duration_to}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="singleDate">
                      <p>TIME:</p>
                      <select
                        value={data.duration_to_time}
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
                value={data.description_of_activity}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        )}
        {currentClass === 3 && (
          <div className="third">
            <div className="equipTitle">
              <h3>EQUIPMENT/MATERIALS NEEDED:</h3>
            </div>
            <div className="equipQuan">
              <div className="checkQuan">
                {equipmentLimit.reachedLimit && (
                  <span style={{ color: "red" }}>
                    Reached limit: {equipmentLimit.limit} of{" "}
                    {equipmentLimit.name}
                  </span>
                )}
                <div className="everyItem">
                  <div className="nthItems">
                    <input
                      type="checkbox"
                      name="monoblock_single"
                      onChange={handleMaterialCheckboxChange}
                    />
                    <p>Single&nbsp;Monoblock&nbsp;Chair</p>
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
        )}
        {currentClass === 4 && (
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
                <div className="attendP" style={{width: '50%'}}>
                  <p>Expected Number of Attendees <br />From Gordon College:</p>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: '10px'
                  }}
                >
                  <input
                    style={{
                      width: "10%",
                    }}
                    type="number"
                    value={data.expected_num_attend_gc}
                    name="expected_num_attend_gc"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="otherSpec">
              <div className="attendGc">
                <div className="attendP" style={{width: '50%'}}>
                  <p>Expected Number of Attendees<br /> Outside of Gordon College:</p>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    marginLeft: '10px'
                  }}
                >
                  <input
                    style={{
                      width: "10%",
                    }}
                    type="number"
                    name="expected_num_attend_out"
                    value={data.expected_num_attend_out}
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
                  value={data.additional_info}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row-reverse",
            marginTop: "20px",
          }}
        >
          {toSubmit ? (
            <div className="subBtn">
              <button type="submit" onClick={handleCheckIfEmpty}>
                UPDATE REQUEST <br />
                FORM
              </button>
            </div>
          ) : (
            <div className="subBtn">
              <button onClick={handleNextClass} disabled={formPagination.next}>
                Next
              </button>
            </div>
          )}
          <div className="subBtn">
            <button
              style={{
                backgroundColor: formPagination.back && "lightblue",
                cursor: formPagination.back ? "not-allowed" : "pointer",
              }}
              onClick={handleBackClass}
              disabled={formPagination.back}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRequestUpdate;
