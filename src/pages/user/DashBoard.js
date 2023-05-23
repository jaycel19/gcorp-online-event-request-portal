import React, { useEffect, useState } from "react";
import Axios from "axios";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import "../../css/DashBoard.css";
import UserRequestUpdate from "../../components/UserRequestUpdate";

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
              <Text>REQUEST INFO:</Text>
            </View>
            <View style={{ margin: "1cm" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View style={styles.paragraph}>
                  <Text>FACILITY:</Text>
                  <Text>TITLE OF EVENT: </Text>
                  <Text>REQUESTOR'S FULL NAME: </Text>
                  <Text>DEPARTMENT: </Text>
                  <Text>CONTACT NUMBER: </Text>
                  <Text>TYPE OF EVENT: </Text>
                </View>
                <View style={{ marginLeft: "40%", fontSize: "14" }}>
                  <Text>{data?.facility}</Text>
                  <Text>{data?.title_event}</Text>
                  <Text>{data?.user_name}</Text>
                  <Text>{data?.department}</Text>
                  <Text>{data?.contact_number}</Text>
                  <Text>{data?.type_of_event}</Text>
                </View>
              </View>
              <View style={styles.paragraph}>
                <Text style={{ marginBottom: "15px" }}>
                  EVENT/ACTIVITY DURATION:{" "}
                </Text>
                <View>
                  <Text>FROM</Text>
                  <Text>
                    {"  "}
                    {data?.duration_from} ${data?.duration_from_time}
                  </Text>
                  <Text>TO</Text>
                  <Text>
                    {"  "}
                    {data?.duration_to} ${data?.duration_to_time}
                  </Text>
                  <View>
                    <Text style={{ marginBottom: "15px" }}>
                      DESCRIPTION OF THE ACTIVITY:{" "}
                    </Text>
                    <Text> {data?.description_of_activity}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.paragraph}>
                <Text style={{ marginBottom: "15px" }}>
                  EQUIPMENT/MATERIAL NEEDED:{" "}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
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
              </View>
              <View style={styles.paragraph}>
                <Text style={{ marginBottom: "15px" }}>
                  OTHER SPECIFICATIONS:
                </Text>
                <View>
                  <Text
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Open to the public?:{" "}
                    <Text style={{ marginLeft: "20%" }}>
                      {data?.open_to_the_public ? "YES" : "NO"}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Expected Number of Attendees from GORDON COLLEGE:{"    "}
                    <Text style={{ marginLeft: "50%" }}>
                      {data?.expected_num_attend_gc}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Expected Number of Attendees from Outside of GORDON COLLEGE:
                    {"   "}
                    <Text style={{ marginLeft: "60%" }}>
                      {"  "}
                      {data?.expected_num_attend_out}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    With food catering?:{" "}
                    <Text style={{ marginLeft: "50%" }}>
                      {data?.cater ? "YES" : "NO"}
                    </Text>
                  </Text>
                  <Text
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Open to the public?:{" "}
                    <Text style={{ marginLeft: "50%" }}>
                      {data?.cater_open_public ? "YES" : "NO"}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.paragraph}>
                <Text style={{ marginBottom: "15px" }}>
                  Additional Information:
                </Text>
                <Text>{data?.additional_info}</Text>
              </View>
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
              backgroundColor: data?.id ? "green" : "lightgreen",
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

  console.log(loggedUser.id);
  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await Axios.get(
          `https://capstone23.com/gcorp/gcorp-backend/api/request/request_from_user.php?id=${loggedUser.id}`
        );
        console.log(response.data);
        setStatus(response.data);
        setStatusIsLoading(false);
        setStatusFetched(true); // Set flag to true
      } catch (error) {
        setStatusIsError(true);
      }
    };
    getStatus();
  }, []);

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

        // Fetch materials for the equipment/material item in the request data
        const equipmentMaterialsId = request.equipment_materials_id;
        const materialUrl = `https://capstone23.com/gcorp/gcorp-backend/api/material/single.php?id=${equipmentMaterialsId}`;
        const materialResponse = await axios.get(materialUrl);
        const materialData = Object.values(materialResponse.data);
        const material = materialData[0];

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
  }, [status, statusFetched, loggedUser.id]);
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
          <p>
            Status Request:{" "}
            {statusIsLoading ? (
              <span>Loading...</span>
            ) : (
              status[loggedUser.id]?.status
            )}{" "}
            <button
              onClick={() => setShowUpdate(!showUpdate)}
              style={{
                cursor: data?.id ? "pointer" : "not-allowed",
                backgroundColor: data?.id ? "green" : "lightgreen",
                color: "#fff",
                borderRadius: "5px",
                padding: "10px 10px",
                border: "none",
                fontWeight: "550",
              }}
              disabled={data?.id ? false : true}
            >
              EDIT REQUEST
            </button>
          </p>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div
              className="requestInfo"
              style={{
                display: "flex",
                flexDirection: "column",
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
                    backgroundColor: data?.id ? "green" : "lightgreen",
                  }}
                  disabled={data?.id ? false : true}
                >
                  EXPAND
                </button>
                <PDFGenerator data={data} />
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
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p>TITLE OF EVENT: </p>
                      <p>REQUESTOR'S FULL NAME: </p>
                      <p>DEPARTMENT: </p>
                      <p>CONTACT NUMBER: </p>
                      <p>TYPE OF EVENT: </p>
                    </div>
                    <div>
                      <p>{data?.title_event}</p>
                      <p>{data?.user_name}</p>
                      <p>{data?.department}</p>
                      <p>{data?.contact_number}</p>
                      <p>{data?.type_of_event}</p>
                    </div>
                  </div>
                  <div>
                    <h3>EVENT/ACTIVITY DURATION: </h3>
                    <div>
                      <h3>FROM</h3>
                      <p>
                        {data?.duration_from} {data?.duration_from_time}
                      </p>
                      <h3>TO</h3>
                      <p>
                        {data?.duration_to} {data?.duration_to_time}
                      </p>
                      <div>
                        <p>DESCRIPTION OF THE ACTIVITY: </p>
                        <p>{data?.description_of_activity}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3>EQUIPMENT/MATERIAL NEEDED: </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p>Single Monoblock Chair</p>
                        <p>Armchairs</p>
                        <p>Tables</p>
                        <p>Microphones</p>
                        <p>Speakers</p>
                        <p>Whiteboard</p>
                      </div>
                      <div>
                        <p>{data?.material?.monoblock_single}</p>
                        <p>{data?.material?.armchairs}</p>
                        <p>{data?.material?.tables}</p>
                        <p>{data?.material?.microphones}</p>
                        <p>{data?.material?.speakers}</p>
                        <p>{data?.material?.whiteboard}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3>OTHER SPECIFICATIONS:</h3>
                    <div>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Open to the public?:{" "}
                        <span style={{ marginLeft: "50%" }}>
                          {data?.open_to_the_public ? "YES" : "NO"}
                        </span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Expected Number of Attendees from GORDON COLLEGE:{" "}
                        <span style={{ marginLeft: "50%" }}>
                          {data?.expected_num_attend_gc}
                        </span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Expected Number of Attendees from Outside of GORDON
                        COLLEGE:{" "}
                        <span style={{ marginLeft: "60%" }}>
                          {data?.expected_num_attend_out}
                        </span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        With food catering?:{" "}
                        <span style={{ marginLeft: "50%" }}>
                          {data?.cater ? "YES" : "NO"}
                        </span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        Open to the public?:{" "}
                        <span style={{ marginLeft: "50%" }}>
                          {data?.cater_open_public ? "YES" : "NO"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3>Additional Information:</h3>
                    <p>{data?.additional_info}</p>
                  </div>
                </>
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
      />
    </div>
  );
};

export default DashBoard;
