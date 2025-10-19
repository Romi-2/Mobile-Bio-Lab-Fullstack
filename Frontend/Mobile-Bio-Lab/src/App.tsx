// frontend/src/App.tsx
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ActivatePage from "./pages/Activepage";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PendingUsers from "./components/PendingUsers";
import UsersList from "./components/UsersList";
import AdminUpdateProfilePage from "./pages/AdminUpdateProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import "./App.css";
import Profile from "./pages/Profile";
import LandingPage from "./pages/Landingpage";
import AdminHome from "./components/Adminhome";
import ForgotPasswordPage from "./pages/Forgetpasswordpage";
import ResetPasswordPage from "./pages/resetpasswordpage";
import AdminReport from "./components/AdminReport";
import ReservationPage from "./pages/Reservationpage";
import ReservationSuccess from "./pages/ReservationSuccess";
import SlotReservationPage from "./pages/SlotReservationPage";
import BluetoothReader from "./components/BluetoothReader";
import ShareSample from "./components/shareSample";
import SamplePage from "./pages/SamplePage";
import ProtocolsList from "./components/ProtocolList";
import AdminProtocols from "./components/AdminProtocol";
import { NotificationProvider } from "./context/notificationContext";
import NotificationPage from "./pages/NotificationPage";
import AdminReservations from "./components/AdminReservation";


function AppContent() {
  const location = useLocation();
  const showHeader =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {showHeader && <Navbar />}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/activate/:studentId" element={<ActivatePage />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />

          {/* Public Protocols Route */}
          <Route path="/protocols" element={<ProtocolsList />} />

          {/* Sample related */}
          <Route path="/dashboard/share/:id" element={<ShareSample />} />
          <Route path="/dashboard/sample/:id" element={<SamplePage />} />
            
          <Route path="admin/reservations" element={<AdminReservations />} /> 
          
          {/* Reservation */}
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/slot-reservation" element={<SlotReservationPage />} />
          <Route path="/reservation-success" element={<ReservationSuccess />} />
          <Route path="/ble-devices" element={<BluetoothReader />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

           <Route path="/notifications" element={<NotificationPage />} />

          {/* User Dashboard */}
          <Route
            path="/userdashboard/*"
            element={
              <ProtectedRoute allowedRoles={["student", "researcher", "technician"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<div>User Dashboard Home</div>} />
            <Route path="protocols" element={<ProtocolsList />} />
            <Route path="sample/:id" element={<SamplePage />} />
          </Route>

          {/* Admin Dashboard */}
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
            <Route path="share/:id" element={<ShareSample />} />
            <Route path="protocols" element={<AdminProtocols />} />
            <Route path="sample/:id" element={<SamplePage />} />
            <Route path="admin/reservations" element={<AdminReservations />} /> 
          </Route>
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;
