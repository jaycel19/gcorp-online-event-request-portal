import React, { useEffect, useState, useRef } from "react";
import "../../css/Users.css";
import axios from "axios";
import User from "../../components/User";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";

const Users = () => {
  const [stdUsers, setStdUsers] = useState([]);
  const [guestUsers, setGuestUsers] = useState([]);
  const [userRerender, setUserRerender] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStdUsers, setFilteredStdUsers] = useState([]);
  const [filteredGuestUsers, setFilteredGuestUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("stdUsers"); // Track the active tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://capstone23.com/gcorp/gcorp-backend/api/user/users.php"
        );
        const data = response.data;
        const stdUsers = Object.values(data).filter(
          (user) => user.userType === "stdUser"
        );
        const guestUsers = Object.values(data).filter(
          (user) => user.userType === "guestUser"
        );
        setStdUsers(stdUsers);
        setGuestUsers(guestUsers);
        setFilteredStdUsers(stdUsers); // Initial filtered data will be stdUsers
        setFilteredGuestUsers(guestUsers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userRerender]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredStdUsers = stdUsers.filter((user) =>
      user.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    const filteredGuestUsers = guestUsers.filter((user) =>
      user.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredStdUsers(filteredStdUsers);
    setFilteredGuestUsers(filteredGuestUsers);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 7;

  const indexOfLastEntry = (currentPage + 1) * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentStdUsers = filteredStdUsers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const currentGuestUsers = filteredGuestUsers.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const totalPages = Math.ceil(
    Math.max(filteredStdUsers.length, filteredGuestUsers.length) /
      entriesPerPage
  );

  const handlePageClick = (pageNumber) => {
    if (pageNumber === totalPages) {
      setCurrentPage(totalPages - 1);
    } else {
      setCurrentPage(pageNumber - 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const pageRangeStart = currentPage < 1 ? 0 : currentPage - 1;
    const pageRangeEnd =
      pageRangeStart + 2 > totalPages - 1 ? totalPages - 1 : pageRangeStart + 2;
    for (let i = pageRangeStart; i <= pageRangeEnd; i++) {
      pageNumbers.push(
        <span
          style={{
            cursor: "pointer",
            backgroundColor: "green",
            padding: "5px 10px",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0f6626",
            },
          }}
          key={i}
          onClick={() => handlePageClick(i + 1)}
        >
          {i + 1}
        </span>
      );
    }
    return (
      <p>
        {currentPage + 1} pages {pageNumbers}
      </p>
    );
  };

  const pdfRef = useRef();
const exportPDF = () => {
    const data = activeTab === 'stdUsers' ? currentStdUsers : currentGuestUsers;
    const userType = activeTab === 'stdUsers' ? 'Student And faculty' : 'Guest Users'
    const doc = new jsPDF();
    doc.autoTable({
      head: [["ID", "User Name", "idNo", "Organization", "contactNumber", "Department", "Domain Email", "User Type"]],
      body: data.map((entry) => [
        entry.id,
        entry.name,
        entry.idNo,
        entry.organization,
        entry.contactNumber,
        entry.department,
        entry.domainEmail,
        userType
      ]),
    });
    doc.save("user-requests.pdf");
  };

  const exportToExcel = () => {
    const data = activeTab === 'stdUsers' ? currentStdUsers : currentGuestUsers;
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Requests");

    writeFile(workbook, "requests.xlsx");
  };
  
  return (
    <div className="Users">
      <div className="controls">
        <div className="search">
          <p>SEARCH</p>
          <input type="text" value={searchTerm} onChange={handleSearch} />
        </div>
        <div className="exportButton">
          <button
            className="red"
            style={{
              cursor: "pointer",
            }}
            onClick={() =>
              exportPDF([...filteredStdUsers, ...filteredGuestUsers])
            }
          >
            EXPORT ALL PDF
          </button>
          <button
            className="green"
            onClick={() =>
              exportToExcel([...filteredStdUsers, ...filteredGuestUsers])
            }
            style={{
              cursor: "pointer",
            }}
          >
            EXPORT ALL EXCEL
          </button>
        </div>
      </div>
      <div
        style={{
          width: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
          marginTop: "100px",
        }}
      >
        <div className="tabs">
          <div
            className={activeTab === "stdUsers" ? "active" : ""}
            onClick={() => setActiveTab("stdUsers")}
          >
            Students and Faculty
          </div>
          <div
            className={activeTab === "guestUsers" ? "active" : ""}
            onClick={() => setActiveTab("guestUsers")}
          >
            Guest Users
          </div>
        </div>
        <h1
          style={{
            width: "100%",
            display: "flex",
            fontWeight: "300",
            letterSpacing: "10px",
          }}
        >
          {activeTab === "guestUsers" ? "Guest Users" : "Students and Faculty"}
        </h1>
        <div
          className="dataTable"
          style={{
            height: searchTerm ? "500px" : "",
            overflow: "auto",
          }}
        >
          {activeTab === "stdUsers" && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>ID NO.</th>
                    <th>Contact Number</th>
                    <th>Department</th>
                    <th>Domain Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerm === ""
                    ? currentStdUsers?.map((data, key) => (
                        <User
                          key={key}
                          data={data}
                          userRerender={userRerender}
                          setUserRerender={setUserRerender}
                        />
                      ))
                    : filteredStdUsers?.map((data, key) => (
                        <User
                          key={key}
                          data={data}
                          userRerender={userRerender}
                          setUserRerender={setUserRerender}
                        />
                      ))}
                </tbody>
              </table>
            </>
          )}
          {activeTab === "guestUsers" && (
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Contact Number</th>
                  <th>Organization</th>
                  <th>Address</th>
                  <th>Domain Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchTerm === ""
                  ? currentGuestUsers?.map((data, key) => (
                      <User
                        key={key}
                        data={data}
                        userRerender={userRerender}
                        setUserRerender={setUserRerender}
                      />
                    ))
                  : filteredGuestUsers?.map((data, key) => (
                      <User
                        key={key}
                        data={data}
                        userRerender={userRerender}
                        setUserRerender={setUserRerender}
                      />
                    ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {searchTerm === "" ? (
        <div
          className="pagination"
          style={{
            display:
              filteredStdUsers.length && filteredGuestUsers.length <= 3
                ? "none"
                : "flex",
          }}
        >
          <div className="entries">
            <p>
              Showing {indexOfFirstEntry + 1} to{" "}
              {indexOfLastEntry >
              Math.max(filteredStdUsers.length, filteredGuestUsers.length)
                ? Math.max(filteredStdUsers.length, filteredGuestUsers.length)
                : indexOfLastEntry}{" "}
              of {Math.max(filteredStdUsers.length, filteredGuestUsers.length)}{" "}
              entries
            </p>
          </div>
          <div className="pages">
            <div className="pages">{renderPageNumbers()}</div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Users;
