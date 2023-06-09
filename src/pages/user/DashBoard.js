import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import "../../css/DashBoard.css";
import UserRequestUpdate from "../../components/UserRequestUpdate";
import Swal from "sweetalert2";
import "../../css/RequestForm.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowDown19,
  faArrowDownUpAcrossLine,
  faArrowUp,
  faBookOpenReader,
  faCancel,
  faEdit,
  faExternalLink,
  faEye,
  faEyeSlash,
  faFilePdf,
  faLink,
} from "@fortawesome/free-solid-svg-icons";

const DashBoard = () => {
  const { loggedUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [statusIsLoading, setStatusIsLoading] = useState(true);
  const [statusIsError, setStatusIsError] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [expandRequest, setExpandRequest] = useState(false);
  const [rerenderCounter, setRerenderCounter] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [statusFetched, setStatusFetched] = useState(false); // Flag variable
  const [defaultRequestDate, setDefaultRequestDate] = useState({
    duration_from: "",
    duration_to: "",
  });

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await Axios.get(
          `https://capstone23.com/gcorp/gcorp-backend/api/request/request_from_user.php?id=${loggedUser.id}`
        );
        setStatus(response.data);
        setStatusIsLoading(false);
        setStatusFetched(true); // Set flag to true
      } catch (error) {
        setStatusIsError(true);
      }
    };
    getStatus();
  }, [rerenderCounter]);

  const formattedDate = dateTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const [data, setData] = useState({});
  const [materialData, setMaterialData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const requestId = status[loggedUser.id]?.id;
        // Fetch data from the single request endpoint
        const singleRequestUrl = `https://capstone23.com/gcorp/gcorp-backend/api/request/single.php?id=${requestId}`;
        const singleRequestResponse = await axios.get(singleRequestUrl);
        const requestData = Object.values(singleRequestResponse.data);
        const request = requestData[0];
        setDefaultRequestDate({
          duration_from: requestData[0].duration_from,
          duration_to: requestData[0].duration_to,
        });
        // Fetch materials for the equipment/material item in the request data
        const equipmentMaterialsId = request.equipment_materials_id;
        const materialUrl = `https://capstone23.com/gcorp/gcorp-backend/api/material/single.php?id=${equipmentMaterialsId}`;
        const materialResponse = await axios.get(materialUrl);
        const materialData = Object.values(materialResponse.data);
        const material = materialData[0];
        setMaterialData(material);
        // Combine the request data with the material data
        const updatedData = {
          ...request,
          material: material,
        };

        // Reformat the data
        const converted = {
          ...updatedData,
          duration_from: new Date(updatedData.duration_from).toLocaleString(
            "en-US",
            options
          ),
          duration_to: new Date(updatedData.duration_to).toLocaleString(
            "en-US",
            options
          ),
          duration_from_time: new Date(
            updatedData.duration_from + " " + updatedData.duration_from_time
          ).toLocaleTimeString("en-US", timeOptions),
          duration_to_time: new Date(
            updatedData.duration_to + " " + updatedData.duration_to_time
          ).toLocaleTimeString("en-US", timeOptions),
        };

        setData(converted);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (statusFetched) {
      // Execute fetchData only when status is fetched
      fetchData();
    }
  }, [status, statusFetched, loggedUser.id, rerenderCounter]);

  const updateStatus = async (data) => {
    try {
      const response = await axios.put(
        "https://capstone23.com/gcorp/gcorp-backend/api/request/update_status.php",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRerenderCounter(!rerenderCounter);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCancelRequest = () => {
    Swal.fire({
      title: "Are you sure you want to reject this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({
          id: data.id,
          status: "Cancelled",
        });
      }
    });
  };

  const textColor = status[loggedUser.id]?.status === "Pending"
  ? "yellow"
  : status[loggedUser.id]?.status === "Approved"
    ? "green"
    : status[loggedUser.id]?.status === "Disapproved"
      ? "red"
      : "black"; // fallback color


  return (
    <div className="DashBoard">
      <div className="header">
        <h1>WELCOME TO</h1>
        <h1>GCORP</h1>
      </div>
      <div className="content">
        <div className="content-sub">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "50%", borderRight: "2px solid darkblue" }}>
              <p style={{ fontWeight: "600", fontSize: "20px" }}>
                Hello! {loggedUser.name}
              </p>
              <div className="time">
                <p>You logged in your account at {formattedDate},</p>
                <p>{formattedTime}</p>
              </div>
            </div>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50%",
                padding: "20px",
              }}
            >
              Request Status:{" "}
              {statusIsLoading ? (
                <span>Loading...</span>
              ) : (
                <span
                  style={{ color: textColor}}
                >
                  {status[loggedUser.id]?.status}
                </span>
              )}{" "}
              {data?.id && (
                <>
                  <button
                    onClick={() => setShowUpdate(!showUpdate)}
                    style={{
                      cursor: data?.id ? "pointer" : "not-allowed",
                      backgroundColor: data?.id ? "#3f51b5" : "lightblue",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "10px 10px",
                      border: "none",
                      fontWeight: "550",
                      marginLeft: "10px",
                      display: data?.status === "Cancelled" ? "none" : "block",
                    }}
                    disabled={data?.id ? false : true}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button
                    onClick={handleCancelRequest}
                    style={{
                      cursor:
                        data?.status === "Cancelled"
                          ? "not-allowed"
                          : "pointer",
                      backgroundColor:
                        data?.status === "Cancelled" ? "#c1c1c1" : "red",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "10px 10px",
                      border: "none",
                      fontWeight: "550",
                      marginLeft: "10px",
                    }}
                    disabled={data?.status === "Cancelled" ? true : false}
                  >
                    <FontAwesomeIcon icon={faCancel} />
                  </button>
                </>
              )}
            </p>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div
              className="requestInfo"
              style={{
                flexDirection: "column",
                display: data?.status === "Cancelled" ? "none" : "flex",
                alignItems: "center",
                marginTop: "10px;",
                justifyContent: "flex-end",
              }}
            >
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "30px",
                }}
              >
                REQUEST INFO:
                <button
                  onClick={() => setExpandRequest(!expandRequest)}
                  style={{
                    marginLeft: "10px",
                    borderRadius: "5px",
                    border: "none",
                    color: "#fff",
                    padding: "10px",
                    cursor: data?.id ? "pointer" : "not-allowed",
                    backgroundColor: data?.id ? "#3f51b5" : "lightblue",
                  }}
                  disabled={data?.id ? false : true}
                >
                  <FontAwesomeIcon icon={expandRequest ? faEyeSlash : faEye} />
                </button>
                {data?.id ? (
                  <Link to="/gcorp/pdf-download" state={{ data: data }}>
                    <button
                      style={{
                        marginLeft: "10px",
                        borderRadius: "5px",
                        border: "none",
                        color: "#fff",
                        padding: "10px",
                        cursor: data?.id ? "pointer" : "not-allowed",
                        backgroundColor: data?.id ? "#3f51b5" : "lightblue",
                      }}
                    >
                      PDF <FontAwesomeIcon icon={faExternalLink} />{" "}
                    </button>
                  </Link>
                ) : (
                  <button
                    style={{
                      marginLeft: "10px",
                      borderRadius: "5px",
                      border: "none",
                      color: "#fff",
                      padding: "10px",
                      cursor: data?.id ? "pointer" : "not-allowed",
                      backgroundColor: data?.id ? "#3f51b5" : "lightblue",
                    }}
                  >
                    PDF <FontAwesomeIcon icon={faExternalLink} />
                  </button>
                )}
              </h2>

              {expandRequest ? (
                <div
                  className="RequestForm"
                  style={{
                    marginTop: "0px",
                    padding: "0px",
                    width: "100%",
                    border: "none",
                  }}
                >
                  <div className="title"></div>
                  <div className="first">
                    <div className="titleHead">
                      <p>
                        PLEASE INDICATE THE SPECIFIC FACILITY TO USE BY CHECKING
                        THE BOX:
                      </p>
                    </div>
                    <div className="facilityList">
                      <input
                        type="checkbox"
                        name="facility"
                        value="Function Hall"
                        checked={
                          data.facility === "Function Hall" ? true : false
                        }
                        //onChange={handleCheckboxChange}
                      />
                      <span>FUNCTION HALL</span>
                      <input
                        type="checkbox"
                        name="facility"
                        value="P.E ROOM"
                        checked={data.facility === "P.E ROOM" ? true : false}
                        //onChange={handleCheckboxChange}
                      />
                      <span>P.E ROOM</span>
                      <input
                        type="checkbox"
                        name="facility"
                        value="OTHER"
                        //onChange={handleCheckboxChange}
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
                        //onChange={handleInputChange}
                      />
                    </div>
                    <div className="eventInfo">
                      <div className="info">
                        <p>TITLE OF EVENT:</p>
                        <input
                          style={{ padding: "10px" }}
                          type="text"
                          name="title_event"
                          value={data.title_event}
                          //onChange={handleInputChange}
                        />
                      </div>
                      <div className="info">
                        <p>REQUESTOR'S FULL NAME:</p>
                        <input
                          style={{ padding: "10px" }}
                          type="text"
                          name="user_name"
                          value={data.user_name}
                          //onChange={handleInputChange}
                        />
                      </div>
                      <div className="info">
                        <p>DEPARTMENT:</p>
                        <select
                          className="deps"
                          style={{ width: "185px" }}
                          value={data.department}
                          //onChange={handleInputChange}
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
                          style={{ padding: "10px" }}
                          name="contact_number"
                          value={data.contact_number}
                          //onChange={handleInputChange}
                        />
                      </div>
                      <div className="info">
                        <p>TYPE OF EVENT:</p>
                        <input
                          type="checkbox"
                          name="type_of_event"
                          value="Conference"
                          checked={
                            data.type_of_event === "Conference" ? true : false
                          }
                          //onChange={handleCheckboxChange}
                        />
                        <span>CONFERENCE</span>
                        <input
                          type="checkbox"
                          name="type_of_event"
                          value="Training"
                          checked={
                            data.type_of_event === "Training" ? true : false
                          }
                          //onChange={handleCheckboxChange}
                        />
                        <span>TRAINING</span>
                        <input
                          type="checkbox"
                          name="type_of_event"
                          value="Seminar"
                          checked={
                            data.type_of_event === "Seminar" ? true : false
                          }
                          //onChange={handleCheckboxChange}
                        />
                        <span>SEMINAR</span>
                        <input
                          type="checkbox"
                          name="type_of_event"
                          value="OTHER"
                          //onChange={handleCheckboxChange}
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
                          //onChange={handleInputChange}
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
                                value={defaultRequestDate.duration_from}
                                //onChange={handleInputChange}
                              />
                            </div>
                            <div className="singleDate">
                              <p>TIME:</p>

                              <select
                                value={data.duration_from_time}
                                name="duration_from_time"
                                //onChange={handleInputChange}
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
                                value={defaultRequestDate.duration_to}
                                //onChange={handleInputChange}
                              />
                            </div>
                            <div className="singleDate">
                              <p>TIME:</p>
                              <select
                                value={data.duration_to_time}
                                name="duration_to_time"
                                //onChange={handleInputChange}
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
                          width: "260px",
                          padding: "20px",
                        }}
                        name="description_of_activity"
                        value={data.description_of_activity}
                        //onChange={handleInputChange}
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
                              checked={
                                materialData.monoblock_single == "0"
                                  ? false
                                  : true
                              }
                              //onChange={handleMaterialCheckboxChange}
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
                            //onChange={handleInputChange}
                            disabled={true}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            style={{ padding: "10px" }}
                          />
                        </div>
                        <div className="everyItem">
                          <div className="nthItems">
                            <input
                              type="checkbox"
                              name="armchairs"
                              checked={
                                materialData.armchairs == "0" ? false : true
                              }
                              //onChange={handleMaterialCheckboxChange}
                            />
                            <p>Armchairs</p>
                          </div>
                          <input
                            type="number"
                            style={{ padding: "10px" }}
                            max="150"
                            min="0"
                            name="armchairs"
                            value={materialData.armchairs}
                            //onChange={handleInputChange}
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
                              checked={
                                materialData.tables == "0" ? false : true
                              }
                              //onChange={handleMaterialCheckboxChange}
                            />
                            <p>Tables</p>
                          </div>
                          <input
                            style={{
                              width: "50px",
                              padding: "10px",
                            }}
                            type="number"
                            max="6"
                            min="0"
                            name="tables"
                            value={materialData.tables}
                            //onChange={handleInputChange}
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
                              checked={
                                materialData.microphones == "0" ? false : true
                              }
                              //onChange={handleMaterialCheckboxChange}
                            />
                            <p>Microphones</p>
                          </div>
                          <input
                            style={{
                              width: "50px",
                              padding: "10px",
                            }}
                            type="number"
                            max="2"
                            min="0"
                            name="microphones"
                            value={materialData.microphones}
                            //onChange={handleInputChange}
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
                              checked={
                                materialData.speakers == "0" ? false : true
                              }
                              //onChange={handleMaterialCheckboxChange}
                            />
                            <p>Speakers</p>
                          </div>
                          <input
                            style={{
                              width: "50px",
                              padding: "10px",
                            }}
                            type="number"
                            max="2"
                            min="0"
                            name="speakers"
                            value={materialData.speakers}
                            //onChange={handleInputChange}
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
                              checked={
                                materialData.whiteboard == "0" ? false : true
                              }
                              //onChange={handleMaterialCheckboxChange}
                            />
                            <p>Whiteboard</p>
                          </div>
                          <input
                            style={{
                              width: "50px",
                              padding: "10px",
                            }}
                            type="number"
                            max="1"
                            min="0"
                            name="whiteboard"
                            value={materialData.whiteboard}
                            //onChange={handleInputChange}
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
                          //onChange={handleCheckboxChange}
                        />
                      </div>
                      <div className="opItem">
                        <p>No</p>
                        <input
                          type="checkbox"
                          name="open_to_the_public"
                          value={false}
                          //onChnage={handleCheckboxChange}
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
                          <input
                            style={{
                              width: "23%",
                              padding: "10px",
                            }}
                            type="number"
                            value={data.expected_num_attend_gc}
                            name="expected_num_attend_gc"
                            //onChange={handleInputChange}
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
                              padding: "10px",
                            }}
                            type="number"
                            name="expected_num_attend_out"
                            value={data.expected_num_attend_out}
                            //onChange={handleInputChange}
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
                              //onChange={handleCheckboxChange}
                            />
                          </div>
                          <div className="foodItem">
                            <p>No</p>
                            <input
                              type="checkbox"
                              name="cater"
                              value={false}
                              //onChange={handleCheckboxChange}
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
                          IF THERE ARE GUEST SPEAKERS OR VIP VISITORS PLEASE
                          WRITE THEIR NAMES BELOW TO NOTIFY THE SECURITY:
                        </p>
                        <textarea
                          style={{ width: "100%", minWidth: "680px" }}
                          name="additional_info"
                          value={data.additional_info}
                          //onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>

      <UserRequestUpdate
        data={data}
        setData={setData}
        setShowUpdate={setShowUpdate}
        showUpdate={showUpdate}
        setRerenderCounter={setRerenderCounter}
        rerenderCounter={rerenderCounter}
        defaultRequestDate={defaultRequestDate}
        setMaterialData={setMaterialData}
        materialData={materialData}
      />
    </div>
  );
};

export default DashBoard;
