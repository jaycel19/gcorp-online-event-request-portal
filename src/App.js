import Login from "./pages/user/Login";
import DashBoard from "./pages/user/DashBoard";
import RequestForm from "./pages/user/RequestForm";
import Header from "./components/Header";

import AdminLogin from "./pages/admin/AdminLogin";
import ManageUserRequestForm from "./pages/admin/UserRequests";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../src/css/App.css";
import AdminHeader from "./components/AdminHeader";
import SideNav from "./components/SideNav";
import { useAuthContext } from "./context/AuthContext";


function App() {
  const { isLogged } = useAuthContext();

  return (
    <div className="App">
      <Router>
        {isLogged.login? 
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

        />
        :
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
        <div className="main-con">
          {isLogged.login && <Header />}
            <Routes>
              <Route path="/" element={isLogged.login ? <DashBoard /> : <Login />} />
              <Route path="/request-form" element={isLogged.login ? <RequestForm /> : <Login />} />
              <Route path="/admin-login" element={isLogged.login ?  <DashBoard /> : <AdminLogin />} />
              <Route path="/user-login" element={isLogged.login ? <DashBoard /> : <Login />  } />
            </Routes>
        </div>
        </Router>
    </div>
  );
}


export default App;
