import Login from "./pages/user/Login";
import Home from "./pages/user/Home";
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
      <SideNav />
      <div className="main-con">
        <Home />
        <RequestForm />
        <Login />
      </div>
    </div>
  );
}

export default App;
