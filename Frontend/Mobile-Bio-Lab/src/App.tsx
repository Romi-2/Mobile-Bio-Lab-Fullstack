import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import ActivatePage from "./pages/Activepage";
import RegistrationSuccess from "./pages/RegistrationSuccess";

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname === "/";

  return (
    <>
      {showHeader && (
        <header className="app-header">
          <h1>Mobile Bio Lab</h1>
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/registration-success" element={<RegistrationSuccess/>} />
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
