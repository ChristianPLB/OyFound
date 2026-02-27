import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import NavAdmin from './navbar/NavAdmin.jsx';
import Navbar from './navbar/Navbar.jsx';
import NavStudent from './navbar/NavStudent.jsx';
import Contact from './pages/Contact.jsx';
import Dashboard from './pages/Dashboard'; // FIX: Must import this
import HomeAdmin from './pages/HomeAdmin.jsx'; // FIX: Must import this
import HomeStudent from './pages/HomeStudent.jsx';
import Messages from './pages/Messages.jsx'; // FIX: Must import this
import Profile from './pages/Profile.jsx';
import ReportItem from './pages/ReportItem.jsx';

function App() {
  const [role, setRole] = useState(() => localStorage.getItem('userRole') || null);

  return (
    <>
      {!role && <Navbar />} 
      {role === 'admin' && <NavAdmin setRole={setRole}/>}
      {role === 'student' && <NavStudent setRole={setRole} />}
      {role === 'guest' && <NavStudent setRole={setRole} />} 

      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setRole={setRole} />} />
        <Route path='/register' element={<Register setRole={setRole} />} />
        <Route path="/contact" element={<Contact/>} />

        {/* Admin Routes */}
        {role === 'admin' && (
          <>
            <Route path='/admin' element={<HomeAdmin />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<ReportItem />} />
          </>
        )}

        {/* Student Routes */}
        {role === 'student' && (
          <>
            <Route path="/student" element={<HomeStudent />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        )}

        {/* Guest Routes - Note lower-case 'guest' to match your registration */}
        {role === 'guest' && (
          <Route path="/student" element={<HomeStudent />} /> 
        )}

        {/* Protected Shared Routes */}
        {role && <Route path="/profile" element={<Profile />} />}

      </Routes>

      <Footer />
    </>
  );
}

export default App;