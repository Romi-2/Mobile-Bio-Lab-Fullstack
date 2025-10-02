// frontend/src/App.tsx
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
import PendingUsers from "./components/PendingUsers"; // ✅ correct path
import UsersList from "./components/UsersList"; // ✅ correct path
import AdminUpdateProfilePage from "./pages/AdminUpdateProfilePage"; // ✅ correct path
import UpdateProfilePage from "./pages/UpdateProfilePage"; // ✅ correct path
import "./App.css";
import Profile from "./pages/Profile";
import LandingPage from "./pages/Landingpage";
import AdminHome from "./components/Adminhome"; // ✅ correct path
import ForgotPasswordPage from "./pages/Forgetpasswordpage";
import ResetPasswordPage from "./pages/resetpasswordpage";
import AdminReport from "./components/AdminReport";
import ReservationPage from "./pages/Reservationpage";
import ReservationSuccess from "./pages/ReservationSuccess";
import SlotReservationPage from "./pages/SlotReservationPage";





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
           <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
           <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
           <Route path="/reservation" element={<ReservationPage />} />
           <Route path="/slot-reservation" element={<SlotReservationPage />} />
          {/* User dashboard */}
         <Route
  path="/userdashboard"
  element={
    <ProtectedRoute allowedRoles={["student", "researcher", "technician"]}>
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
            <Route index element={<AdminHome />} />
            <Route path="pending" element={<PendingUsers />} />
            <Route path="users" element={<UsersList />} />
            <Route path="profile" element={<UpdateProfilePage />} />
            <Route path="profile/:id" element={<AdminUpdateProfilePage />} />
            <Route path="reports" element={<AdminReport />} /> 
            {/* <Route path="reservation-pending" element={<ReservationPending />} /> */}
          </Route>

          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/activate/:studentId" element={<ActivatePage />} />
           {/* Success page */}
        <Route path="/reservation-success" element={<ReservationSuccess />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
