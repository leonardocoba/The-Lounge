"use client";

import { usePathname } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase";
import RoomLayout from "../../components/RoomLayout";
import Link from "next/link";
import Draggable from "react-draggable";
// Icons
import TitleIcon from "@mui/icons-material/Title";
import GifBoxIcon from "@mui/icons-material/GifBox";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import BackupIcon from "@mui/icons-material/Backup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MicIcon from "@mui/icons-material/Mic";

const RoomPage = () => {
  const pathname = usePathname(); // Get the current path
  const [roomData, setRoomData] = useState<any>(null);
  const [membersData, setMembersData] = useState<any[]>([]); // Store member details
  const [cameraOn, setCameraOn] = useState(true); // Camera toggle state
  const [micOn, setMicOn] = useState(true); // Microphone toggle state

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomId = pathname.split("/").pop(); // Extract roomId from the URL path
      if (roomId) {
        const roomRef = doc(db, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const roomInfo = roomSnap.data();
          setRoomData(roomInfo);

          // Fetch user data for each member
          const memberPromises = roomInfo?.members?.map(
            async (userId: string) => {
              const userRef = doc(db, "users", userId);
              const userSnap = await getDoc(userRef);
              return userSnap.exists() ? { userId, ...userSnap.data() } : null;
            }
          );

          const memberDetails = (await Promise.all(memberPromises)).filter(
            Boolean
          ) as any[];
          setMembersData(memberDetails);
        } else {
          console.error("Room not found");
        }
      }
    };

    fetchRoomData();
  }, [pathname]);

  const handleCameraClick = async () => {
    setCameraOn((prev) => !prev);
    console.log(`Camera ${cameraOn ? "off" : "on"}`);
  };

  const handleMicClick = () => {
    setMicOn((prev) => !prev);
    console.log(`Mic ${micOn ? "off" : "on"}`);
  };

  if (!roomData) {
    return <div>Loading...</div>;
  }

  return (
    <RoomLayout>
      <div className="h-screen w-screen bg-[#1e0e4b] flex flex-col items-center justify-between p-4 relative">
        {/* Top middle room name */}
        <div className="text-white text-4xl font-bold mb-4 absolute top-4">
          {roomData.roomName}
        </div>

        {/* Main content area with camera/mic buttons */}
        <div className="h-4/5 w-4/5 flex relative">
          {/* Vertical bar for camera and mic buttons */}
          <div className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 bg-[#a080ff] p-4 rounded-r-lg shadow-lg">
            <button
              onClick={handleCameraClick}
              className={`text-white p-2 rounded-full transition-colors shadow-md ${
                cameraOn ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
              }`}
            >
              <CameraAltIcon />
            </button>
            <button
              onClick={handleMicClick}
              className={`text-white p-2 rounded-full transition-colors shadow-md ${
                micOn ? "bg-red-500 hover:bg-red-700" : "bg-gray-500"
              }`}
            >
              <MicIcon />
            </button>
          </div>

          {/* Purple screen (Main content area) */}
          <div className="bg-[#a080ff] h-full w-full rounded-3xl flex items-center justify-center relative">
            {membersData.map((member, index) => (
              <Draggable key={member.userId} bounds="parent">
                <div
                  className="bg-white text-center text-black flex items-center justify-center rounded-full"
                  style={{
                    width: "100px",
                    height: "100px",
                    position: "absolute",
                    top: `${index * 20 + 10}%`,
                    left: `${index * 20 + 10}%`,
                    cursor: "pointer",
                  }}
                >
                  {member.username}
                </div>
              </Draggable>
            ))}
          </div>
        </div>

        {/* Bottom feature bar */}
        <div className="bg-[#a080ff] h-[60px] w-[40%] rounded-3xl mt-8 absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-8">
          <TitleIcon className="text-white text-3xl cursor-pointer" />
          <GifBoxIcon className="text-white text-3xl cursor-pointer" />
          <PresentToAllIcon className="text-white text-3xl cursor-pointer" />
          <VideogameAssetIcon className="text-white text-3xl cursor-pointer" />
          <BackupIcon className="text-white text-3xl cursor-pointer" />
        </div>

        {/* Top right leave room bar */}
        <Link href="/dashboard">
          <div className="bg-[#a080ff] h-[60px] w-[150px] rounded-3xl absolute top-4 right-4 flex justify-center items-center cursor-pointer hover:bg-red-500 transition-colors">
            <ArrowBackIcon className="text-white hover:text-red-500 transition-colors" />
          </div>
        </Link>
      </div>
    </RoomLayout>
  );
};

export default RoomPage;
