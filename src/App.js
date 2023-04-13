import Login from "./pages/user/Login";
import DashBoard from "./pages/user/DashBoard";
import RequestForm from "./pages/user/RequestForm";
import Header from "./components/Header";

import AdminLogin from "./pages/admin/AdminLogin";
import ManageUserRequestForm from "./pages/admin/UserRequests";

import "../src/css/App.css";
import AdminHeader from "./components/AdminHeader";
import SideNav from "./components/SideNav";


function App() {
  return (
    <div className="App">
      <SideNav 
        navList={[
          'Dashboard',
          'Request Form',
          'Event Request Information'
        ]}
      />
      <div className="main-con">
        <DashBoard />
      </div>
    </div>
  );
}

export default App;
