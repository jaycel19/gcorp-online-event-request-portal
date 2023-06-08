import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "../../css/AdminDashboard.css";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const AdminDashboard = () => {
  const localizer = momentLocalizer(moment);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [requests, setRequests] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState({
    cancelled: 0,
    requested: 0,
    pending: 0,
    approved: 0,
    disapproved: 0,
  });

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };
  const handleClosePopover = () => {
    setSelectedEvent(null);
  };

  const renderEventPopover = () => {
    if (selectedEvent) {
      const { title, start, end, resource } = selectedEvent;
      return (
        <div className="eventModal" style={{ zIndex: "10", padding: 10, }}>
          <div className="modal-content" style={{width: '300px'}}>
            <h4>{title}</h4>
            <p>Start: {moment(start).format("MMMM Do YYYY, h:mm:ss a")}</p>
            <p>End: {moment(end).format("MMMM Do YYYY, h:mm:ss a")}</p>
            <p>Facility: {resource}</p>
            <button onClick={handleClosePopover}>Close</button>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    // fetch data from the endpoint
    axios
      .get(
        "https://capstone23.com/gcorp/gcorp-backend/api/request/requests.php"
      )
      .then((response) => {
        // filter the requests by status
        const filteredRequests = Object.values(response.data).filter(
          (request) => {
            const status = request.status;
            return (
              status === "Approved" ||
              status === "Cancelled" ||
              status === "Pending" ||
              status === "Disapproved"
            );
          }
        );
        const calendarEvents = Object.values(response.data).filter((events) => {
          return (
            events.status !== "Cancelled" && events.status !== "Disapproved"
          );
        });

        setEvents(calendarEvents);
        // count the requests by status
        const counts = filteredRequests.reduce((acc, request) => {
          const status = request.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // initialize pie chart data
        const pieChartData = {
          labels: [
            "Cancelled",
            "Requested",
            "Pending",
            "Approved",
            "Disapproved",
          ],
          datasets: [
            {
              label: "Requests Count",
              data: [
                counts.Cancelled || 0,
                Object.values(response.data).length,
                counts.Pending || 0,
                counts.Approved || 0,
                counts.Disapproved || 0,
              ],
              backgroundColor: ["red", "blue", "#e6b800", "green", "red"],
            },
          ],
        };

        // initialize pie chart options
        const pieChartOptions = {
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        };

        // initialize bar chart data
        const barChartData = {
          labels: [
            "Cancelled",
            "Requested",
            "Pending",
            "Approved",
            "Disapproved",
          ],
          datasets: [
            {
              label: "Requests Count",
              data: [
                counts.Cancelled || 0,
                Object.values(response.data).length,
                counts.Pending || 0,
                counts.Approved || 0,
                counts.Disapproved || 0,
              ],
              backgroundColor: ["red", "blue", "#e6b800", "green", "red"],
            },
          ],
        };

        // initialize bar chart options
        const barChartOptions = {
          indexAxis: "y",
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        };

        if (isMounted) {
          // update the state with the filtered requests
          setRequests(filteredRequests);
          // update the state with the total counts
          setTotal({
            cancelled: counts.Cancelled || 0,
            requested: Object.values(response.data).length,
            pending: counts.Pending || 0,
            approved: counts.Approved || 0,
            disapproved: counts.Disapproved || 0,
          });

          // create pie chart instance
          const pieChart = new Chart(pieChartRef.current, {
            type: "pie",
            data: pieChartData,
            options: pieChartOptions,
          });

          // create bar chart instance
          const barChart = new Chart(barChartRef.current, {
            type: "bar",
            data: barChartData,
            options: barChartOptions,
          });

          // cleanup pie chart and bar chart instances
          return () => {
            pieChart.destroy();
            barChart.destroy();
          };
        }
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });

    // cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  console.log(events);
  const getCalendarEvents = () => {
    if (events.length > 0) {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      return events.map((request) => {
        const {
          facility,
          title_event,
          duration_from,
          duration_to,
          duration_from_time,
          duration_to_time,
        } = request;
        const fromDate = new Date(duration_from + " " + duration_from_time);
        const toDate = new Date(duration_to + " " + duration_to_time);
        return {
          title: title_event,
          start: moment.utc(fromDate).toDate(),
          end: moment.utc(toDate).toDate(),
          resource: facility,
        };
      });
    } else {
      return [];
    }
  };

  return (
    <div className="AdminDashboard">
      <div className="container">
        <div className="grid">
          <div className="left">
            <div className="cancelled-request">
              <span>TOTAL CANCELLED:</span> <span> {total.cancelled}</span>
            </div>
            <div className="event-requested">
              <span>TOTAL REQUESTS:</span> <span> {total.requested}</span>
            </div>
            <div className="pending-request">
              <span>TOTAL PENDING:</span> <span>{total.pending}</span>
            </div>
            <div className="approved-request">
              <span>TOTAL APPROVED:</span> <span>{total.approved}</span>
            </div>
            <div
              className="approved-request"
              style={{ backgroundColor: "red" }}
            >
              <span>TOTAL DISAPPROVED:</span> <span>{total.disapproved}</span>
            </div>
          </div>
          <div className="right">
            <div className="pie-chart-container">
              <div style={{ height: "250px", width: "300px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <canvas ref={pieChartRef}></canvas>
              </div>
            </div>
            <div className="bar-chart-container">
              <div style={{ height: "400px", width: "300px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
        <div className="calendar">
          <Calendar
            events={getCalendarEvents(requests)}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            style={{ height: 800, width: 900 }}
            onSelectEvent={handleEventSelect}
          />
          {renderEventPopover()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
