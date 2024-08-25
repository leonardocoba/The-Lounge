"use client";
import { useState } from "react";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-[#1e0e4b] flex items-center justify-center p-4 relative">
      {/* Container for the circular layout */}
      <div className="relative h-full w-full flex items-center justify-between">
        {/* Left Square with more rounded corners and icons */}
        <div className="bg-[#7747ff] h-4/5 w-[10%] rounded-3xl flex-shrink-0 flex flex-col items-center justify-center space-y-8">
          {/* Icons vertically aligned */}
          <ModeCommentIcon className="text-gray-300" fontSize="large" />

          {/* AddIcon as a button */}
          <button
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none"
            onClick={openModal}
          >
            <AddIcon className="text-gray-300" fontSize="large" />
          </button>

          <SettingsIcon className="text-gray-300" fontSize="large" />
        </div>

        {/* Right Square with more rounded corners */}
        <div className="bg-[#a080ff] h-4/5 w-[85%] rounded-3xl flex-shrink-0"></div>
      </div>

      {/* Modal Pop-Up */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-lg w-[400px]">
            <h2 className="text-2xl font-bold text-center mb-4">
              Create A Room
            </h2>
            <input
              type="text"
              placeholder="Room Name"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
