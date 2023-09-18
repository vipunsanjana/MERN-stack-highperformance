import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDoctor from './pages/ApplyDoctor';
import Notifications from './pages/Notifications';
import UsersList from './pages/Admin/UsersList';
import DoctorsList from './pages/Admin/DoctorsList';
import Profile from './pages/Doctor/Profile';
import BookAppoinment from './pages/BookAppoinment';
import Appointment from './pages/Appointment';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';

function App() {

  const {loading} = useSelector(state => state.alerts);

  return (
    <BrowserRouter>
      {loading && (<div className="spinner-parent">
        <div class="spinner-border"  role="status">
          
        </div>
      </div>)}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/" element=
          {
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="/apply-doctor" element=
          {
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          } 
        />
        <Route path="/notifications" element=
          {
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/userslist" element=
          {
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          } 
        />
        <Route path="/admin/doctorslist" element=
          {
            <ProtectedRoute>
              <DoctorsList />
            </ProtectedRoute>
          } 
        />
        <Route path="/doctor/profile/:userId" element=
          {
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/book-appoinment/:doctorId" element=
          {
            <ProtectedRoute>
              <BookAppoinment />
            </ProtectedRoute>
          } 
        />
        <Route path="/appointment" element=
          {
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          } 
        />
        <Route path="/doctor/appointment" element=
          {
            <ProtectedRoute>
              <DoctorAppointment />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
