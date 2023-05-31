import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import "../../css/DashBoard.css";
import UserRequestUpdate from "../../components/UserRequestUpdate";
import Swal from "sweetalert2";
import "../../css/RequestForm.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginRight: "1cm",
  },
  header: {
    fontWeight: 800,
    padding: 10,
    borderBottom: "1px solid #000",
    color: "#fff",
    backgroundColor: "green",
  },
  paragraph: {
    marginBottom: 40,
    fontSize: 14,
  },
});

const PDFGenerator = ({ html, data }) => {
  return (
    <PDFDownloadLink
      document={
        <Document>
          <Page size="A4" style={styles.container}>
            <View style={styles.header}>
              <Text>REQUEST FORM FOR USE OF GC FACILITIES</Text>
            </View>
            <View style={styles.paragraph}>
              <Text>
                PLEASE INDICATE THE SPECIFIC FACILITY TO USE BY CHECKING THE
                BOX:
              </Text>
            </View>
            <View style={styles.paragraph}>
              <View style={styles.paragraph}>
                <Text>FACILITY:</Text>
                <Text>TITLE OF EVENT:</Text>
                <Text>REQUESTOR'S FULL NAME:</Text>
                <Text>DEPARTMENT:</Text>
                <Text>CONTACT NUMBER:</Text>
                <Text>TYPE OF EVENT:</Text>
              </View>
              <View style={styles.paragraph}>
                <View>
                  <Text>FUNCTION HALL</Text>
                  <Text>P.E ROOM</Text>
                  <Text>OTHER:</Text>
                </View>
                <View style={{ marginLeft: "40%", fontSize: 14 }}>
                  <Text>{data.facility}</Text>
                  <Text>{data.title_event}</Text>
                  <Text>{data.user_name}</Text>
                  <Text>{data.department}</Text>
                  <Text>{data.contact_number}</Text>
                  <Text>{data.type_of_event}</Text>
                </View>
              </View>
            </View>
            <View style={styles.paragraph}>
              <Text>EVENT/ACTIVITY DURATION:</Text>
              <View>
                <Text>FROM</Text>
                <Text>
                  {data.duration_from} {data.duration_from_time}
                </Text>
                <Text>TO</Text>
                <Text>
                  {data.duration_to} {data.duration_to_time}
                </Text>
              </View>
              <View>
                <Text>DESCRIPTION OF ACTIVITY:</Text>
                <Text>{data.description_of_activity}</Text>
              </View>
            </View>
            <View style={styles.paragraph}>
              <Text>EQUIPMENT/MATERIALS NEEDED:</Text>
              <View>
                <Text>Single Monoblock Chair</Text>
                <Text>Armchairs</Text>
                <Text>Tables</Text>
                <Text>Microphones</Text>
                <Text>Speakers</Text>
                <Text>Whiteboard</Text>
              </View>
              <View style={{ marginLeft: "50%" }}>
                <Text>{data?.material?.monoblock_single}</Text>
                <Text>{data?.material?.armchairs}</Text>
                <Text>{data?.material?.tables}</Text>
                <Text>{data?.material?.microphones}</Text>
                <Text>{data?.material?.speakers}</Text>
                <Text>{data?.material?.whiteboard}</Text>
              </View>
            </View>
            <View style={styles.paragraph}>
              <Text>ADDITIONAL INFORMATION:</Text>
              <Text>{data.additional_info}</Text>
            </View>
          </Page>
        </Document>
      }
      fileName="request_info.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? (
          "Generating PDF..."
        ) : (
          <button
            style={{
              cursor: data?.id ? "pointer" : "not-allowed",
              backgroundColor: data?.id ? "#3f51b5" : "lightblue",
              color: "#fff",
              borderRadius: "5px",
              border: "none",
              padding: "10px",
              marginLeft: "10px",
            }}
          >
            Download PDF
          </button>
        )
      }
    </PDFDownloadLink>
  );
};

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
  const pdfRef = useRef();
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

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = -5;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`request-id-${data.id}.pdf`);
    });
  };
  return (
    <div className="DashBoard">
      <div className="header">
        <h1>WELCOME TO</h1>
        <h1>GCORP</h1>
      </div>
      <div className="content">
        <div className="content-sub">
          <p>Hello! {loggedUser.name}</p>
          <div className="time">
            <p>You logged in your account at {formattedDate},</p>
            <p>{formattedTime}</p>
          </div>
          <p style={{ display: "flex", alignItems: "center" }}>
            Status Request:{" "}
            {statusIsLoading ? (
              <span>Loading...</span>
            ) : (
              status[loggedUser.id]?.status
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
                  EDIT REQUEST
                </button>

                <button
                  onClick={handleCancelRequest}
                  style={{
                    cursor:
                      data?.status === "Cancelled" ? "not-allowed" : "pointer",
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
                  CANCEL REQUEST
                </button>
              </>
            )}
          </p>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div
              className="requestInfo"
              style={{
                flexDirection: "column",
                display: data?.status === "cancelled" ? "none" : "flex",
              }}
            >
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
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
                  EXPAND
                </button>
                <button
                  onClick={downloadPDF}
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
                  Download PDF
                </button>
              </h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p>FACILITY: </p>
                <p>{data?.facility}</p>
              </div>
              {expandRequest ? (
                <div
                  className="RequestForm"
                  style={{ marginTop: "0px", width: "100%", border: "none" }}
                  ref={pdfRef}
                >
                  <div className="title">
                    <h2>REQUEST FORM FOR USE OF GC FACILITIES</h2>
                  </div>
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
                          style={{ padding: "10px" , lineHeight: '20px'}}
                          type="text"
                          name="title_event"
                          value={data.title_event}
                          //onChange={handleInputChange}
                        />
                      </div>
                      <div className="info">
                        <p>REQUESTOR'S FULL NAME:</p>
                        <input
                          style={{ padding: "10px" , lineHeight: '20px'}}
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
                          style={{ padding: "10px" , lineHeight: '20px'}}
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
                            style={{ padding: "10px" , lineHeight: '20px'}}
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
                            style={{ padding: "10px" , lineHeight: '20px'}}
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
                            style={{ width: "50px", padding: "10px" , lineHeight: '20px'}}
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
                            style={{ width: "50px", padding: "10px" , lineHeight: '20px'}}
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
                            style={{ width: "50px", padding: "10px" , lineHeight: '20px'}}
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
                            style={{ width: "50px", padding: "10px", lineHeight: '20px' }}
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
                              lineHeight: "20px",
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
                              lineHeight: "20px",
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
