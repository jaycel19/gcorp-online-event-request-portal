import Login from "./pages/user/Login";
import DashBoard from "./pages/user/DashBoard";
import RequestForm from "./pages/user/RequestForm";
import Header from "./components/Header";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ManageUserRequestForm from "./pages/admin/UserRequests";

import { Routes, Route } from "react-router-dom";

import "../src/css/App.css";
import AdminHeader from "./components/AdminHeader";
import SideNav from "./components/SideNav";
import { useAuthContext } from "./context/AuthContext";
import Users from "./pages/admin/Users";
import { useEffect, useState } from "react";
import EventRequestInfo from "./pages/user/EventRequestInfo";
import { faCalendar, faCircleInfo, faDatabase, faFileCirclePlus, faFileLines, faGear, faHouse } from "@fortawesome/free-solid-svg-icons";
import Signup from "./pages/user/Signup";
import UserCalendar from "./pages/user/UserCalendar";
import PdfDownload from "./pages/user/PdfDownload";
import { useLocation } from "react-router-dom";


function App() {
  const { loggedUser, isAdminLogged } = useAuthContext();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [title, setTitle] = useState('GCORP');
  const location = useLocation();
  const currentUrl = location.pathname;
  useEffect(() => {
    if (isAdminLogged.login === true) {
      setTitle('GCORP-ADMIN');

      document.title = title;
    } else if (loggedUser.login === true) {
      setTitle('GCORP-USER');

      document.title = title;
    }
  }, [])

  console.log(currentUrl)
  return (
    <div className="App">
     {currentUrl !== '/gcorp/pdf-download' &&
      <div className="side-con">
        {isAdminLogged?.login &&
          <SideNav
            setSideNavOpen={setSideNavOpen}
            sideNavOpen={sideNavOpen}
            sideTitle="ADMIN PORTAL"
            navList={[
              {
                name: 'Dashboard',
                path: '/gcorp/',
                icon: faDatabase
              },
              {
                name: 'Manage Request Forms',
                path: '/gcorp/manage-request-form',
                icon: faFileLines
              },
              {
                name: 'Manage Users',
                path: '/gcorp/manage-users',
                icon: faGear
              }
            ]}

          />}
        {loggedUser?.login &&
          <SideNav
            sideNavOpen={sideNavOpen}
            setSideNavOpen={setSideNavOpen}
            sideTitle="USER PORTAL"
            navList={[
              {
                name: 'Dashboard',
                path: '/gcorp/',
                icon: faHouse
              },
              {
                name: 'Calendar',
                path: '/gcorp/calendar',
                icon: faCalendar
              },
              {
                name: 'Request Events',
                path: '/gcorp/request-form',
                icon: faFileCirclePlus
              },
              {
                name: 'Event Request Information',
                path: '/gcorp/event-info',
                icon: faCircleInfo
              }
            ]}
          />}
      </div>
     }
      <div className="main-con"
        style={{
          width: isAdminLogged.login || loggedUser.login ? '80%': '100%',
          marginLeft: isAdminLogged.login || loggedUser.login && currentUrl !== '/gcorp/pdf-download' ? '20%': '0',
        }}
      >
        {loggedUser?.login && currentUrl !== '/gcorp/pdf-download' && <Header setSideNavOpen={setSideNavOpen} />}
        {isAdminLogged?.login && currentUrl !== '/gcorp/pdf-download' && <AdminHeader setSideNavOpen={setSideNavOpen} />}
        <div className="container" style={{ marginTop: isAdminLogged.login  && '200px', paddingTop: loggedUser.login && currentUrl !== "/gcorp/pdf-download" && '200px' }}>
          {isAdminLogged?.login &&
            <Routes>
              <Route path="/gcorp/" element={isAdminLogged?.login ? <AdminDashboard /> : <Login />} />
              <Route path="/gcorp/manage-request-form" element={isAdminLogged?.login ? <ManageUserRequestForm /> : <Login />} />
              <Route path="/gcorp/admin-login" element={isAdminLogged?.login ? <AdminDashboard /> : <AdminLogin />} />
              <Route path="/gcorp/manage-users" element={isAdminLogged?.login ? <Users /> : <Login />} />
            </Routes>
          }
          {loggedUser?.login &&
            <Routes>
              <Route path="/gcorp/" element={loggedUser?.login ? <DashBoard /> : <Login />} />
              <Route path="/gcorp/request-form" element={loggedUser?.login ? <RequestForm /> : <Login />} />
              <Route path="/gcorp/admin-login" element={loggedUser?.login ? <DashBoard /> : <AdminLogin />} />
              <Route path="/gcorp/event-info" element={loggedUser?.login ? <EventRequestInfo /> : <Login />} />
              <Route path="/gcorp/calendar" element={loggedUser?.login ? <UserCalendar /> : <Login />} />
              <Route path="/gcorp/pdf-download" element={loggedUser?.login ? <PdfDownload /> : <Login />} />
            </Routes>
          }
          {!loggedUser?.login && !isAdminLogged?.login &&
            <Routes>
              <Route path="/gcorp/" element={<Login />} />
              <Route path="/gcorp/signup" element={<Signup />} />
              <Route path="/gcorp/admin-login" element={<AdminLogin />} />
              <Route path="/gcorp/user-login" element={<Login />} />
            </Routes>
          }
        </div>
      </div>
    </div>
  );
}


export default App;
