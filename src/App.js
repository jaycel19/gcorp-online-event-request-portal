import Login from "./pages/user/Login";
import DashBoard from "./pages/user/DashBoard";
import RequestForm from "./pages/user/RequestForm";
import Header from "./components/Header";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ManageUserRequestForm from "./pages/admin/UserRequests";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../src/css/App.css";
import AdminHeader from "./components/AdminHeader";
import SideNav from "./components/SideNav";
import { useAuthContext } from "./context/AuthContext";
import Users from "./pages/admin/Users";


function App() {
  const { loggedUser, isAdminLogged } = useAuthContext();

  return (
    <div className="App">
      <Router>
        {isAdminLogged?.login &&
          <SideNav
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
        {loggedUser.login &&
          <SideNav
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
        {!loggedUser.login && !isAdminLogged.login &&
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
        {isAdminLogged?.login &&
          <div className="main-con">
            {isAdminLogged?.login && <AdminHeader />}
            <Routes>
              <Route path="/" element={isAdminLogged?.login ? <AdminDashboard /> : <Login />} />
              <Route path="/manage-request-form" element={isAdminLogged?.login ? <ManageUserRequestForm /> : <Login />} />
              <Route path="/manage-users" element={isAdminLogged?.login ?  <Users /> : <Login />} />
            </Routes>
          </div>}
        {loggedUser?.login &&
          <div className="main-con">
            {loggedUser.login && <Header />}
            <Routes>
              <Route path="/" element={loggedUser?.login ? <DashBoard /> : <Login />} />
              <Route path="/request-form" element={loggedUser?.login ? <RequestForm /> : <Login />} />
              <Route path="/admin-login" element={loggedUser?.login ? <DashBoard /> : <AdminLogin />} />
              <Route path="/user-login" element={loggedUser?.login ? <DashBoard /> : <Login />} />
            </Routes>
          </div>}
        {!loggedUser.login && !isAdminLogged.login &&
          <div className="main-con">
            {isAdminLogged?.login && <AdminHeader />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/user-login" element={<Login />} />
            </Routes>
          </div>
        }
      </Router>
    </div>
  );
}


export default App;
