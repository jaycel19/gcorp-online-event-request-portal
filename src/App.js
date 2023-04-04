import Login from "./pages/Login";
import Home from "./pages/Home";
import RequestForm from "./pages/RequestForm";
import Header from "./components/Header";
import "../src/css/App.css";


function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-con">
        <RequestForm />
      </div>
    </div>
  );
}

export default App;
