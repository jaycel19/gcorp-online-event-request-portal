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
import { useState } from "react";


function App() {
  const { loggedUser, isAdminLogged } = useAuthContext();
  const [sideNavOpen, setSideNavOpen] = useState(false);

  return (
    <div className="App">
      <div className="side-con">
      {isAdminLogged?.login &&
        <SideNav
          setSideNavOpen={setSideNavOpen}
          sideNavOpen={sideNavOpen}
          navList={[
            {
              name: 'Dashboard',
              path: '/'
            },
            {
              name: 'Manage Request Forms',
              path: 'manage-request-form'
            },
            {
              name: 'Manage Users',
              path: 'manage-users'
            }
          ]}

        />}
      {loggedUser?.login &&
        <SideNav
          sideNavOpen={sideNavOpen}
          setSideNavOpen={setSideNavOpen}
          navList={[
            {
              name: 'Dashboard',
              path: '/'
            },
            {
              name: 'Request Form',
              path: 'request-form'
            },
            {
              name: 'Event Request Information',
              path: 'event-info'
            }
          ]}

        />}
      {!loggedUser?.login && !isAdminLogged?.login &&
        <SideNav
          navList={[
            {
              name: 'User',
              path: 'user-login'
            },
            {
              name: 'Admin',
              path: 'admin-login'
            }
          ]}
        />
      }
      </div>
      <div className="main-con">
        {loggedUser?.login && <Header setSideNavOpen={setSideNavOpen} />}
        {isAdminLogged?.login && <AdminHeader setSideNavOpen={setSideNavOpen} />}
        <div className="container">
          {isAdminLogged?.login &&
            <Routes>
              <Route path="/" element={isAdminLogged?.login ? <AdminDashboard /> : <Login />} />
              <Route path="/manage-request-form" element={isAdminLogged?.login ? <ManageUserRequestForm /> : <Login />} />
              <Route path="/manage-users" element={isAdminLogged?.login ? <Users /> : <Login />} />
            </Routes>
          }
          {loggedUser?.login &&
            <Routes>
              <Route path="/" element={loggedUser?.login ? <DashBoard /> : <Login />} />
              <Route path="/request-form" element={loggedUser?.login ? <RequestForm /> : <Login />} />
              <Route path="/admin-login" element={loggedUser?.login ? <DashBoard /> : <AdminLogin />} />
              <Route path="/user-login" element={loggedUser?.login ? <DashBoard /> : <Login />} />
            </Routes>
          }
          {!loggedUser?.login && !isAdminLogged?.login &&
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/user-login" element={<Login />} />
            </Routes>
          }
        </div>
      </div>
    </div>
  );
}


export default App;
