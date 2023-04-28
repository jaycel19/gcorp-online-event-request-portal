import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import '../../css/AdminDashboard.css';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    approved: 0
  })



  const handleEventSelect = event => {
    setSelectedEvent(event);
  }
  const handleClosePopover = () => {
    setSelectedEvent(null);
  }

  const renderEventPopover = () => {
    if (selectedEvent) {
      const { title, start, end, resource } = selectedEvent;
      return (
        <div style={{ backgroundColor: 'white', padding: 10 }}>
          <div>
            <h4>{title}</h4>
            <p>Start: {moment(start).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p>End: {moment(end).format('MMMM Do YYYY, h:mm:ss a')}</p>
            <p>Facility: {resource}</p>
            <button onClick={handleClosePopover}>Close</button>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

  useEffect(() => {
    let isMounted = true;

    // fetch data from the endpoint
    axios.get('http://localhost/gcorp/api/request/requests.php')
      .then(response => {
        // filter the requests by status
        const filteredRequests = Object.values(response.data).filter(request => {
          const status = request.status;
          return status === "approved" || status === "cancelled" || status === "pending";
        });
        const calendarEvents = Object.values(response.data).filter(events => {
          return events.status !== "cancelled"
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
          labels: ['Cancelled', 'Requested', 'Pending', 'Approved'],
          datasets: [{
            label: 'Requests Count',
            data: [counts.cancelled || 0, Object.values(response.data).length, counts.pending || 0, counts.approved || 0],
            backgroundColor: ['red', 'blue', '#fcba03', 'green']
          }]
        };

        // initialize pie chart options
        const pieChartOptions = {
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        };

        // initialize bar chart data
        const barChartData = {
          labels: ['Cancelled', 'Requested', 'Pending', 'Approved'],
          datasets: [{
            label: 'Requests Count',
            data: [counts.cancelled || 0, Object.values(response.data).length, counts.pending || 0, counts.approved || 0],
            backgroundColor: ['red', 'blue', '#fcba03', 'green']
          }]
        };

        // initialize bar chart options
        const barChartOptions = {
          indexAxis: 'y',
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        };

        if (isMounted) {
          // update the state with the filtered requests
          setRequests(filteredRequests);
          // update the state with the total counts
          setTotal({
            cancelled: counts.cancelled || 0,
            requested: Object.values(response.data).length,
            pending: counts.pending || 0,
            approved: counts.approved || 0
          });

          // create pie chart instance
          const pieChart = new Chart(pieChartRef.current, {
            type: 'pie',
            data: pieChartData,
            options: pieChartOptions
          });

          // create bar chart instance
          const barChart = new Chart(barChartRef.current, {
            type: 'bar',
            data: barChartData,
            options: barChartOptions
          });

          // cleanup pie chart and bar chart instances
          return () => {
            pieChart.destroy();
            barChart.destroy();
          };
        }
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });

    // cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  console.log(events);
  const getCalendarEvents = () => {
    if (events.length > 0) {
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      return events.map(request => {
        const { facility, title_event, duration_from, duration_to, duration_from_time, duration_to_time } = request;
        const fromDate = new Date(duration_from + ' ' + duration_from_time);
        const toDate = new Date(duration_to + ' ' + duration_to_time);
        return {
          title: title_event,
          start: moment.utc(fromDate).toDate(),
          end: moment.utc(toDate).toDate(),
          resource: facility
        }
      });
    } else {
      return [];
    }
  }


  return (
    <div className="AdminDashboard">
      <h1>Requests Count</h1>
      <div className="container">
        <div className='grid'>
          <div className="cancelled-request">
            TOTAL CANCELLED: {total.cancelled}
          </div>
          <div className="event-requested">
            TOTAL REQUESTS: {total.requested}
          </div>
          <div className="pending-request">
            TOTAL PENDING: {total.pending}
          </div>
          <div className="approved-request">
            TOTAL APPROVED: {total.approved}
          </div>
          <div className="calendar">
            <Calendar
              events={getCalendarEvents(requests)}
              localizer={localizer}
              startAccessor="start"
              endAccessor="end"
              views={['month']}
              style={{ height: 800, width: 1000 }}
              onSelectEvent={handleEventSelect}
            />
            {renderEventPopover()}
          </div>
        </div>
        <div className="right">
          <div className="pie-chart-container">
            <div style={{ height: '300px', width: '300px' }}>
              <canvas ref={pieChartRef}></canvas>
            </div>
          </div>
          <div className="bar-chart-container">
            <div style={{ height: '300px', width: '300px' }}>
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
