import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import ActivatePage from "./pages/Activepage";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Home from "./pages/Home"; // ✅ import Home page
import Navbar from "./components/Navbar"; // ✅ make sure path is correct

function AppContent() {
  const location = useLocation(); // ✅ no error if react-router-dom v6 is installed
  const showHeader = location.pathname !== "/login" && location.pathname !== "/register"; 

  return (
    <>
      {showHeader && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />  {/* ✅ Home is now the first page */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/activate/:studentId" element={<ActivatePage />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
