import Login from "./pages/user/Login";
import Home from "./pages/user/Home";
import RequestForm from "./pages/user/RequestForm";
import Header from "./components/Header";

import AdminLogin from "./pages/admin/AdminLogin";

import "../src/css/App.css";


function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-con">
        <AdminLogin />
      </div>
    </div>
  );
}

export default App;
