import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard"; // ✅ correct path
import ActivatePage from "./pages/Activepage";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PendingUsers from "./components/PendingUsers/PendingUsers"; // ✅ correct path
import UsersList from "./components/UsersList/UsersList"; // ✅ correct path
import AdminUpdateProfilePage from "./pages/AdminUpdateProfilePage"; // ✅ correct path
import UpdateProfilePage from "./pages/UpdateProfilePage"; // ✅ correct path
import "./App.css";
import Profile from "./pages/Profile";
import LandingPage from "./pages/Landingpage";
import AdminHome from "./components/Adminhome/Adminhome"; // ✅ correct path

function AppContent() {
  const location = useLocation();
  const showHeader =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {showHeader && <Navbar />}
      <main>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {/* User dashboard */}
          <Route
            path="/Userdashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard with nested routes */}
          <Route
  path="/adminDashboard/*"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
>
  <Route index element={<AdminHome />} /> {/* default content */}
  <Route path="pending" element={<PendingUsers />} />
  <Route path="users" element={<UsersList />} />
  <Route path="profile" element={<UpdateProfilePage />} />
  <Route path="profile/:id" element={<AdminUpdateProfilePage />} />
</Route>


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
