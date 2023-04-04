import Login from "./pages/Login";
import Home from "./pages/Home";
import Header from "./components/Header";
import "../src/css/App.css";


function App() {
  return (
    <div className="App">
      <Header />     
      <div className="main-con">
        <Home />
      </div>
    </div>
  );
}

export default App;
