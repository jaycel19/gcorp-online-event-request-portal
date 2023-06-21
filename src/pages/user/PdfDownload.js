import React, { useRef } from "react";
import GClogo from "../../images/gcdlogo.jpg";
import GClogo2 from "../../images/gcdlogo2.png";
import { Link, useLocation } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../css/PdfDownload.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const PdfDownload = () => {
  const location = useLocation();
  const { data } = location.state;
  const pdfRef = useRef();
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
      const imgY = 0;
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
    <div>
      <div>
        <Link to="/gcorp/">
          <button
            style={{
              padding: "20px",
              border: "none",
              backgroundColor: "#3f51b5",
              color: "#fff",
              borderRadius: "5px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              style={{ marginRight: "5px" }}
            />
            Go back
          </button>
        </Link>
      </div>
      <div
        ref={pdfRef}
        style={{
          minWidth: "950px",
          width: "950px",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={GClogo} alt="gclogo" style={{ width: "150px" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ margin: "0px" }}>Republic of the Philippines</p>
            <p style={{ margin: "0px" }}>City of Olongapo</p>
            <h2 style={{ margin: "0px" }}>GORDON COLLEGE</h2>
            <p style={{ margin: "0px", textAlign: "center" }}>
              Olongapo Sports Complex, Donor St, East Tapinac, Olongapo City
            </p>
          </div>
          <img style={{ width: "150px" }} src={GClogo2} alt="gclogo2" />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: "0px" }}>
            OFFICE OF THE VICE PRESIDENT FOR ADMINISTRATION AND FINANCE
          </h2>
          <h2 style={{ margin: "0px", color: "brown" }}>
            REQUEST FORM FOR USE OF GC FACILITIES
          </h2>
        </div>
        <div className="mainTable">
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                minHeight: "140px",
                width: "54.5%",
                border: "1px solid black",
                height: "140px",
                padding: "6px",
                marginRight: ".5%",
              }}
            >
              <p>
                &#x2022; Reservation will not be confirmed until this request
                form is completely accomplished and approved by the VP for
                Administration and Finance.
              </p>
              <p>
                &#x2022; Make sure to provide a copy of this form to the
                concerned units.
              </p>
            </div>
            <table
              style={{
                minHeight: "150px",
                width: "44.5%",
                height: "150px",
                marginLeft: ".5%",
              }}
            >
              <tr>
                <th>Received copy by:</th>
                <th>Data:</th>
              </tr>
              <tr>
                <td>MIS</td>
                <td></td>
              </tr>
              <tr>
                <td>Supply</td>
                <td></td>
              </tr>
              <tr>
                <td>Security</td>
                <td></td>
              </tr>
              <tr>
                <td>Maintenance</td>
                <td></td>
              </tr>
            </table>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid black",
              marginTop: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderBottom: "1px solid black",
              }}
            >
              <p>
                Please indicate the specific facility to use by checking the
                box:
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="boxes">
                  {data.facility === "Function Hall" ? "/" : ""}
                </div>
                <p>FUNCTION HALL</p>
                <div className="boxes">
                  {data.facility === "P.E ROOM" ? "/" : ""}
                </div>
                <p>PE ROOM</p>
                <div className="boxes">
                  {data.facility !== "Function Hall" &&
                  data.facility !== "P.E ROOM"
                    ? "/"
                    : ""}
                </div>
                <p>
                  OTHER:{" "}
                  {data.facility !== "Function Hall" &&
                    data.facility !== "P.E ROOM" ? data.facility : ''}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderBottom: "1px solid black",
              }}
            >
              <p className="data-input">{data.title_event}</p>
              <p>{`(TITLE OF EVENT)`}</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid black",
              }}
            >
              <p>REQUESTOR'S FULL NAME:</p>
              <p style={{ marginLeft: "50px" }} className="data-input">{data.user_name}</p>
            </div>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid black",
              }}
            >
              <div
                style={{
                  width: "50%",
                  borderRight: ".5px solid black",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>DEPARTMENT: </p>
                <p style={{ marginLeft: "50px" }} className="data-input">{data.department}</p>
              </div>
              <div
                style={{
                  width: "50%",
                  borderLeft: ".5px solid black",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>CONTACT NUMBER: </p>
                <p style={{ marginLeft: "50px" }} className="data-input">{data.contact_number}</p>
              </div>
            </div>
            <div
              className="typeEvent"
              style={{
                display: "flex",
                borderBottom: "1px solid black",
                justifyContent: "space-evenly",
              }}
            >
              <div
                className="event"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <p>TYPE OF EVENT: </p>
                <p>{`(check only 1)`}</p>
              </div>
              <div
                className="event"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "10px",
                }}
              >
                <p>Conference</p>
                <div className="boxes">
                  {data.type_of_event === "Conference" ? "/" : ""}
                </div>
              </div>
              <div
                className="event"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "10px",
                }}
              >
                <p>Training</p>
                <div className="boxes">
                  {data.type_of_event === "Training" ? "/" : ""}
                </div>
              </div>
              <div
                className="event"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "10px",
                }}
              >
                <p>Seminar</p>
                <div className="boxes">
                  {data.type_of_event === "Seminar" ? "/" : ""}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "10px",
                }}
              >
                <p style={{ margin: "0px" }}>Forum</p>
                <div className="boxes">
                  {data.type_of_event === "Forum" ? "/" : ""}
                </div>
              </div>
              <div
                className="event"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "10px",
                }}
              >
                <p>Colloquium</p>
                <div className="boxes">
                  {data.type_of_event === "Colloquium" ? "/" : ""}
                </div>
              </div>
              <div
                className="event"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "10px",
                }}
              >
                <p>Orientation</p>
                <div className="boxes">
                  {data.type_of_event === "Orientation" ? "/" : ""}
                </div>
              </div>
              <div
                className="event"
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="eventOther"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <div className="boxes">
                    {data.type_of_event !== "Orientation" ||
                    data.type_of_event !== "Colloquium" ||
                    data.type_of_event !== "Seminar" ||
                    data.type_of_event !== "Training" ||
                    data.type_of_event !== "Forum" ||
                    data.type_of_event !== "Conference"
                      ? ""
                      : "/"}
                  </div>
                  <p>Others</p>
                </div>
                <p>{`(please specify below:)`}</p>
                <p style={{ height: "40px" }} className="data-input">
                  {data.type_of_event !== "Orientation" ||
                    data.type_of_event !== "Colloquium" ||
                    data.type_of_event !== "Seminar" ||
                    data.type_of_event !== "Training" ||
                    data.type_of_event !== "Forum" ||
                    data.type_of_event !== "Conference" && data.type_of_event}
                </p>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                minHeight: "30px",
                borderBottom: "1px solid black",
              }}
            ></div>
            <div
              className="eventDurationContainer"
              style={{
                display: "flex",
                borderBottom: "1px solid black",
              }}
            >
              <div
                className="eventDuration"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%",
                  borderRight: "1px solid black",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p>EVENT/ACTIVITY DURATION</p>
                </div>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <table
                    style={{
                      width: "50%",
                    }}
                  >
                    <tr>
                      <th colSpan={2}>FROM</th>
                    </tr>
                    <tr>
                      <th>DATE</th>
                      <th>TIME</th>
                    </tr>
                    <tr>
                      <td style={{ fontSize: "16px", padding: "15px 10px" }} className="data-input">
                        {data.duration_from}
                      </td>
                      <td style={{ fontSize: "16px", padding: "15px 10px" }} className="data-input">
                        {data.duration_from_time}
                      </td>
                    </tr>
                  </table>
                  <table style={{ width: "50%" }}>
                    <tr>
                      <th colSpan={2}>TO</th>
                    </tr>
                    <tr>
                      <th>DATE</th>
                      <th>TIME</th>
                    </tr>
                    <tr>
                      <td style={{ fontSize: "16px", padding: "15px 10px" }} className="data-input">
                        {data.duration_to}
                      </td>
                      <td style={{ fontSize: "16px", padding: "15px 10px" }} className="data-input">
                        {data.duration_to_time}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <div style={{ width: "55%" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p>DESCRIPTION OF ACTIVITY</p>
                </div>
                <p className="data-input">{data.description_of_activity}</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid black",
              }}
            >
              <table
                style={{
                  width: "45%",
                }}
              >
                <tr>
                  <th style={{ padding: "5px" }}>EQUIPMENT/MATERIALS NEEDED</th>
                  <th style={{ padding: "5px" }}>QUANTITY: </th>
                </tr>
                <tr>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <div className="boxes">
                      {parseInt(data.material.monoblock_single) !== 0
                        ? "/"
                        : ""}
                    </div>
                    <p>Single Mono-block Chairs</p>
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.material.monoblock_single}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <div className="boxes">
                      {parseInt(data.material.armchairs) !== 0 ? "/" : ""}
                    </div>
                    <p>Armchairs</p>
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.material.armchairs}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <div className="boxes">
                      {parseInt(data.material.tables) !== 0 ? "/" : ""}
                    </div>
                    <p>Tables</p>
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.material.tables}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <div className="boxes">
                      {parseInt(data.material.microphones) !== 0 ? "/" : ""}
                    </div>
                    <p>Microphones {`(Max. 2)`}</p>
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.material.microphones}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <div className="boxes">
                      {parseInt(data.material.speakers) !== 0 ? "/" : ""}
                    </div>
                    <p>Speakers</p>
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.material.speakers}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                  >
                    <div className="boxes">
                      {parseInt(data.material.whiteboard) !== 0 ? "/" : ""}
                    </div>
                    <p>Whiteboard</p>
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.material.whiteboard}
                  </td>
                </tr>
              </table>
              <table style={{ width: "55%" }}>
                <tr>
                  <th colSpan={2} style={{ padding: "1px" }}>
                    OTHER SPECIFICATIONS:
                  </th>
                </tr>
                <tr>
                  <td style={{ padding: "10px" }}>Open to the public?</td>
                  <td
                    style={{
                      display: "flex",
                      border: "none",
                      alignItems: "center",
                      marginTop: "15px",
                      margin: "10px",
                      marginBottom: "0px",
                    }}
                  >
                    <div className="boxes">
                      {data.open_to_the_public && "/"}
                    </div>
                    <p>Yes</p>
                    <div className="boxes">
                      {!data.open_to_the_public && "/"}
                    </div>
                    <p>No</p>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px" }}>
                    Expected Number of Attendees From Gordon College:
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.expected_num_attend_gc}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px" }}>
                    Expected Number of Attendees Outside of Gordon College:
                  </td>
                  <td style={{ textAlign: "center" }} className="data-input">
                    {data.expected_num_attend_out}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px" }}>With Food Catering?</td>
                  <td
                    style={{
                      display: "flex",
                      border: "none",
                      alignItems: "center",
                      marginTop: "15px",
                      margin: "10px",
                      marginBottom: "0px",
                    }}
                  >
                    <div className="boxes">{data.cater_open_public && "/"}</div>
                    <p>Yes</p>
                    <div className="boxes">
                      {!data.cater_open_public && "/"}
                    </div>
                    <p>No</p>
                  </td>
                </tr>
              </table>
            </div>
            <div
              className="additionalInfo"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ border: "1px solid black" }}>
                <p style={{ margin: "0px" }}>ADDITIONAL INFORMATION</p>
              </div>
              <div
                style={{
                  borderTop: "1px solid black",
                  border: "1px solid black",
                }}
              >
                <p style={{ margin: "0px" }}>
                  If there are guest speakers or VIP visitors please write their
                  names below to notify the security:{" "}
                </p>
                <table
                  style={{
                    width: "100%",
                    borderTop: "1px solid black",
                    border: "none",
                  }}
                >
                  <tr>
                    <td
                      style={{
                        minHeight: "160px",
                        height: "160px",
                        display: "flex",
                        padding: "10px",
                      }}
                      className="data-input"
                    >
                      {data.additional_info}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "50%",
              }}
            >
              <hr />
              <p>REQUESTOR'S SIGNATURE OVER PRINTED NAME</p>
              <p>
                I have agreed to the policies and terms given by the office of
                the VPAF. I accept full responsibility for any damages done
                during the event/activity.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "35%",
                marginTop: "20px",
                marginLeft: "20px",
              }}
            >
              <div>
                <p>Noted by: </p>
                <hr />
                <p>DEAN/DEPARTMENT HEAD:</p>
              </div>
              <div>
                <p>approved by:</p>
                <hr />
                <p>ERLINDA C. ABARINTOS, DIT</p>
                <p>VP, Administration and Finance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <button
          onClick={downloadPDF}
          style={{
            padding: "20px",
            border: "none",
            backgroundColor: "#3f51b5",
            color: "#fff",
            borderRadius: "5px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          DOWNLOAD
        </button>
      </div>
    </div>
  );
};

export default PdfDownload;
