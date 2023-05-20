import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useAuthContext } from "../../context/AuthContext";
import "../../css/UserCalendar.css";

const CustomEvent = ({ event }) => {
  const {loggedUser} = useAuthContext();
  return (
    <div className="customEvent">
      <strong>{loggedUser.id === event.user_id ? event.title_event : "RESERVED" }</strong>
      {loggedUser.id === event.user_id ? <p>Other event details...</p> : <p>{`${event.duration_from} to ${event.duration_to}`}</p>}
    </div>
  );
};
const Popup = ({ event, top, left, onClose }) => {
  const {loggedUser} = useAuthContext();
  console.log(event.user_id)
  return (
    <div
      className="popup"
      style={{
        position: "absolute",
        top: top,
        left: left,
        backgroundColor: "#fff",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        zIndex: 9999,
      }}
    >
      <button className="close-button" onClick={onClose}>
        X
      </button>
      {loggedUser.id === event.user_id ? <p>Title: {event.title_event}</p>: <p>RESERVED</p>}
      {loggedUser.id === event.user_id ? <p>User Name: {event.user_name}: </p> : <p>{`${event.duration_from} to ${event.duration_to}`}</p>}
      {/* Include additional event details as needed */}
    </div>
  );
};

const UserCalendar = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const { loggedUser } = useAuthContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const calendarRef = useRef(null);
  console.log(events)
  const handleClosePopup = () => {
    setSelectedEvent(null);
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

  const handleEventSelect = (event, e) => {
    setSelectedEvent(event);
    const rect = calendarRef.current.getBoundingClientRect();
    const top = e.clientY - rect.top - 10;
    const left = e.clientX - rect.left + 10;
    setPopupPosition({ top, left });
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
        {selectedEvent && (
          <Popup
            event={selectedEvent}
            top={popupPosition.top}
            left={popupPosition.left}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  );
};

export default UserCalendar;
