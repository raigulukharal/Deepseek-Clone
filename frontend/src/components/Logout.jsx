import React from 'react';
import { useDispatch } from 'react-redux';
import { setlogout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/authAPI';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }

    dispatch(setlogout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout} 
      className="bg-red-600 px-4 py-2 text-white rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
};

export default Logout;