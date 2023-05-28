import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import "../../css/UserCalendar.css";
import Modal from "react-modal";

const CustomEvent = ({ event }) => {
  const { loggedUser } = useAuthContext();
  return (
    <div className="customEvent">
      <strong>
        {loggedUser.id === event.user_id ? event.title_event : "RESERVED"}
      </strong>
      {loggedUser.id === event.user_id ? (
        <p>Other event details...</p>
      ) : (
        <p>{`${event.duration_from} to ${event.duration_to}`}</p>
      )}
    </div>
  );
};

const UserCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const { loggedUser } = useAuthContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const calendarRef = useRef(null);
  console.log(events);
  const handleCloseModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://capstone23.com/gcorp/gcorp-backend/api/request/requests.php"
        );
        const data = response.data;
        const calendarEvents = Object.values(data)
          .filter((event) => event.status !== "cancelled")
          .map((event) => ({
            ...event,
            start: moment(
              `${event.duration_from} ${event.duration_from_time}`
            ).toDate(),
            end: moment(
              `${event.duration_to} ${event.duration_to_time}`
            ).toDate(),
          }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFacilityChange = (facility) => {
    setSelectedFacility(facility);
  };

  const filteredEvents = selectedFacility
    ? events.filter((event) => event.facility === selectedFacility)
    : events;

  const eventStyleGetter = (event) => {
    const color = event.user_id === loggedUser.id ? "blue" : "green";
    return {
      style: {
        backgroundColor: color,
        cursor: "pointer",
      },
    };
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="UserCalendar">
      <div>
        <label htmlFor="facility">Select Facility:</label>
        <select
          id="facility"
          value={selectedFacility}
          onChange={(e) => handleFacilityChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="P.E ROOM">P.E ROOM</option>
          <option value="Function Hall">FUNCTION HALL</option>
        </select>
      </div>
      <div style={{ position: "relative" }}>
        <div ref={calendarRef}>
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent,
            }}
          />
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Event Details"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: "10",
            },
            content: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "20px",
              backgroundColor: "#fff",
              maxWidth: "300px",
              width: "100%",
              maxHeight: "150px",
              overflow: "auto",
            },
          }}
        >
          {selectedEvent && (
            <div style={{display: "flex", flexDirection: 'column', alignItems: 'center'}}>
              <div style={{
                width: "100%",
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <button
                  style={{
                    backgroundColor: "white",
                    fontWeight: 600,
                    border: "none",
                  }}
                  className="close-button"
                  onClick={handleCloseModal}
                >
                  X
                </button>
              </div>
              <p>Title: {selectedEvent.title_event}</p>
              {loggedUser.id === selectedEvent.user_id && (
                <p>User Name: {selectedEvent.user_name}</p>
              )}
              <p>
                {loggedUser.id === selectedEvent.user_id
                  ? "Other event details..."
                  : `${selectedEvent.duration_from} to ${selectedEvent.duration_to}`}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserCalendar;
