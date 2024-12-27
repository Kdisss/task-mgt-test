import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Auth from './Pages/Auth/Auth';
import Admin from './Pages/AdminDashboard/Admin';
import User from './Pages/UserDashboard/User';
import UserManagement from './Pages/AdminDashboard/UserManagement';
import axios from 'axios';

function App() {
  // Check if the token exists in localStorage


  useEffect(() => {
    // Set the Authorization header globally with the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []); // Empty dependency array to run once when the component mounts

  const token = localStorage.getItem('token');
  const role = localStorage.getItem("role");

  return (
<Router>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/admin"
          element={role === "ROLE-ADMIN" ? <Admin /> : <Admin />}
        />
        <Route
          path="/dashboard/admin/manage-users"
          element={role === "ROLE-ADMIN" ? <UserManagement /> : <UserManagement />}
        />
        <Route
          path="/dashboard/user"
          element={role === "ROLE-CUSTOMER" ? <User /> : <User />}
        />
      </Routes>
    </Router>
  );
}

export default App;


// return (
//   <Router>
//     <Routes>
//       {/* Public Route */}
//       <Route path="/" element={<Auth />} />

//       {/* Protected Routes */}
//       <Route
//         path="/dashboard/admin"
//         element={
//           role === "ROLE-ADMIN" ? (
//             <Admin />
//           ) : (
//             <div>
//               <h2>Access Denied</h2>
//               <p>You are not authorized to view this page.</p>
//             </div>
//           )
//         }
//       />
//       <Route
//         path="/dashboard/user"
//         element={
//           role === "ROLE-CUSTOMER" ? (
//             <User />
//           ) : (
//             <div>
//               <h2>Access Denied</h2>
//               <p>You are not authorized to view this page.</p>
//             </div>
//           )
//         }
//       />
//       <Route
//         path="/dashboard/admin/manage-users"
//         element={
//           role === "ROLE-ADMIN" ? (
//             <UserManagement />
//           ) : (
//             <div>
//               <h2>Access Denied</h2>
//               <p>You are not authorized to view this page.</p>
//             </div>
//           )
//         }
//       />
      
//     </Routes>
//   </Router>
// );
