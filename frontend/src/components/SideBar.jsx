// SideBar.js
import React, { useEffect, useState } from "react";
import { FaTimes, FaComment, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';

const SideBar = ({ onNewChat, closeSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  const [todaysPrompt, setTodaysPrompt] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchTodaysPrompt = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:4000/api/v1/deepseekai/today-prompt", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodaysPrompt(res.data.prompt || null);
    } catch (error) {
      console.error("Error fetching today's prompt:", error);
    }
  };

  const clearPrompt = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post("http://localhost:4000/api/v1/deepseekai/clearPrompt", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodaysPrompt(null);
    } catch (error) {
      console.error("Error clearing today's prompt:", error);
    }
  };

  useEffect(() => {
    fetchTodaysPrompt();
  }, []);

  return (
    <div className="flex flex-col w-full h-full px-2 py-2 sm:px-4 sm:py-4 md:px-6 lg:px-8 xl:px-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-base sm:text-sm md:text-xl font-bold text-white">Deepseek</h1>
        {closeSidebar && (
          <button className="text-white hover:opacity-80" onClick={closeSidebar}>
            <FaTimes size={16} className="sm:size-5" />
          </button>
        )}
      </div>

      {/* New Chat */}
      <div className="mb-4">
        <div
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md p-2 sm:p-3 flex items-center justify-center gap-2 cursor-pointer transition"
          onClick={onNewChat}
        >
          <FaComment size={16} className="sm:size-5" />
          <span className="text-xs sm:text-sm font-semibold">New Chat</span>
        </div>
      </div>

      {/* Today's Prompt */}
      <div className="flex-1 overflow-y-auto text-white mb-4">
        {todaysPrompt ? (
          <div
            className="cursor-pointer hover:bg-gray-700 p-2 sm:p-3 rounded-md transition"
            onClick={clearPrompt}
          >
            <div className="font-medium text-xs sm:text-sm mb-1">Today's First Prompt</div>
            <div className="text-xs sm:text-sm">{todaysPrompt.content}</div>
          </div>
        ) : (
          <div className="text-xs text-gray-300">No prompt for today</div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <img
            src={user?.profileImage || "https://i.pravatar.cc/100"}
            alt="Profile"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300"
          />
          <span className="text-xs sm:text-sm text-white">
            {user ? user.firstname : "My Profile"}
          </span>
        </div>
        <div
          className="flex items-center gap-1 sm:gap-2 text-white cursor-pointer hover:opacity-80"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-base sm:text-lg" />
          <span className="text-xs sm:text-sm">LogOut</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
