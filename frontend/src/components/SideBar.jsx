import React, { useEffect, useState } from "react";
import { FaTimes, FaComment, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { aiAPI } from '../services/aiAPI';
import { authAPI } from '../services/authAPI';

const SideBar = ({ onNewChat, closeSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  const [todaysPrompt, setTodaysPrompt] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchTodaysPrompt = async () => {
    try {
      const res = await aiAPI.getTodayPrompt();
      setTodaysPrompt(res.data.prompt || null);
    } catch (error) {
      console.error("Error fetching today's prompt:", error);
    }
  };

  const clearPrompt = async () => {
    try {
      await aiAPI.clearPrompt();
      setTodaysPrompt(null);
    } catch (error) {
      console.error("Error clearing today's prompt:", error);
    }
  };

  useEffect(() => {
    fetchTodaysPrompt();
  }, []);

  return (
    <div className="flex flex-col w-full h-full px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">Deepseek</h1>
        {closeSidebar && (
          <button className="text-white hover:opacity-80 transition-opacity" onClick={closeSidebar}>
            <FaTimes size={20} />
          </button>
        )}
      </div>
      <div className="mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md p-3 w-full flex items-center justify-center gap-2 cursor-pointer transition-colors"
          onClick={onNewChat}
        >
          <FaComment size={18} />
          <span className="font-semibold">New Chat</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto text-white mb-6">
        <h2 className="font-medium text-sm mb-3 text-gray-400">Today's First Prompt</h2>
        {todaysPrompt ? (
          <div
            className="cursor-pointer hover:bg-gray-700 p-3 rounded-md transition-colors"
            onClick={clearPrompt}
          >
            <div className="text-sm text-gray-300">{todaysPrompt.content}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-300">No prompt for today</div>
        )}
      </div>
      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.profileImage || "https://i.pravatar.cc/100"}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <span className="text-sm text-white">
            {user ? `${user.firstname} ${user.lastname}` : "My Profile"}
          </span>
        </div>
        <button
          className="flex items-center gap-2 text-white cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-lg" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;