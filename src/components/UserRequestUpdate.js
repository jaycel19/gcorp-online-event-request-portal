import React, { useEffect, useState } from "react";
import "../css/RequestUpdate.css";
import axios from "axios";
import Swal from "sweetalert2";

const UserRequestUpdate = ({
  data,
  setData,
  setShowUpdate,
  showUpdate,
  setRerenderCounter,
  rerenderCounter,
}) => {
  const [requestData, setRequestData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
  const [materialData, setMaterialData] = useState({
    id: data?.equipment_materials_id,
    monoblock_single: data?.material?.monoblock_single,
    armchairs: data?.material?.armchairs,
    microphones: data?.material?.microphones,
    speakers: data?.material?.speakers,
    whiteboard: data?.material?.whiteboard,
    tables: data?.material?.tables,
  });

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
        monoblock_single: data?.material?.monoblock_single,
        armchairs: data?.material?.armchairs,
        microphones: data?.material?.microphones,
        speakers: data?.material?.speakers,
        whiteboard: data?.material?.whiteboard,
        tables: data?.material?.tables,
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

  const handleMaterialInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setMaterialData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  return (
    <div
      className="RequestUpdate"
      style={{ display: `${showUpdate ? "flex" : "none"}`, zIndex: "10" }}
    >
      <div
        className="modal-content-update"
        style={{
          borderLeft: "10px solid green",
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
                name="department"
                value={data.department}
                onChange={handleInputChange}
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
              value={data.type_of_event}
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
                      <option value="7:00 am">7:00 AM</option>
                      <option value="9:00 am">9:00 AM</option>
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
                    <option value="7:00 am">7:00 AM</option>
                    <option value="9:00 am">9:00 AM</option>
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
                  <input type="checkbox" name="monoblock_single" />
                  <p>Single Monoblock Chair</p>
                </div>
                <input
                  type="number"
                  name="monoblock_single"
                  value={materialData.monoblock_single}
                  onChange={handleMaterialInputChange}
                />
              </div>
              <div className="everyItem">
                <div className="nthItems">
                  <input type="checkbox" name="armchairs" />
                  <p>Armchairs</p>
                </div>
                <input
                  type="number"
                  name="armchairs"
                  value={materialData.armchairs}
                  onChange={handleMaterialInputChange}
                />
              </div>
              <div className="everyItem">
                <div className="nthItems">
                  <input type="checkbox" name="tables" />
                  <p>Tables</p>
                </div>
                <input
                  type="number"
                  name="tables"
                  value={materialData.tables}
                  onChange={handleMaterialInputChange}
                />
              </div>
              <div className="everyItem">
                <div className="nthItems">
                  <input type="checkbox" name="microphones" />
                  <p>Microphones</p>
                </div>
                <input
                  type="number"
                  max="2"
                  name="microphones"
                  value={materialData.microphones}
                  onChange={handleMaterialInputChange}
                />
              </div>
              <div className="everyItem">
                <div className="nthItems">
                  <input type="checkbox" name="speakers" />
                  <p>Speakers</p>
                </div>
                <input
                  type="number"
                  name="speakers"
                  value={materialData.speakers}
                  onChange={handleMaterialInputChange}
                />
              </div>
              <div className="everyItem">
                <div className="nthItems">
                  <input type="checkbox" name="whiteboard" />
                  <p>Whiteboard</p>
                </div>
                <input
                  type="number"
                  name="whiteboard"
                  value={materialData.whiteboard}
                  onChange={handleMaterialInputChange}
                />
              </div>
              <div className="everyItem">
                <div className="nthItems">
                  <input type="checkbox" name="other" />
                  <p className="specify">
                    <span>Others </span>
                    <span>pls.Specify </span>
                    <input
                      name=""
                      style={{
                        borderBottom: "1px solid #000",
                        backgroundColor: "#fff",
                        width: "100px",
                      }}
                      type="text"
                    />
                  </p>
                </div>
                <input type="text" />
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
              <textarea
                value={data.expected_num_attend_gc}
                name="expected_num_attend_gc"
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
          <div className="otherSpec">
            <div className="attendGc">
              <div className="attendP">
                <p>Expected Number of Attedees</p>
                <p>Outside of Gordon College:</p>
              </div>
              <textarea
                name="expected_num_attend_out"
                value={data.expected_num_attend_out}
                onChange={handleInputChange}
              ></textarea>
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
            <div className="caterFood">
              <p className="public">
                <span>Open to the public?</span>
              </p>
              <div className="cateRight">
                <div className="foodItem">
                  <p>Yes</p>
                  <input
                    type="checkbox"
                    name="cater_open_public"
                    value={true}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <div className="foodItem">
                  <p>No</p>
                  <input
                    type="checkbox"
                    name="cater_open_public"
                    value={false}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
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
                value={data.additional_info}
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

export default UserRequestUpdate;
