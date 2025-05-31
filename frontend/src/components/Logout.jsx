// src/components/Logout.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { setlogout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Notify backend to clear cookies if needed
      await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    console.log("Before logout:", localStorage.getItem("token"));
    dispatch(setlogout());
    console.log("After logout - Redux:");

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700">
      Logout
    </button>
  );
};

export default Logout;
