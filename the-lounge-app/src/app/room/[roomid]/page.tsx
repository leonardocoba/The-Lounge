"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import Draggable from "react-draggable";

// These go inside the bottom feature bar in this specific order; all are clickable
import TitleIcon from "@mui/icons-material/Title";
import GifBoxIcon from "@mui/icons-material/GifBox";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import BackupIcon from "@mui/icons-material/Backup";

// This goes on the leave room button; it turns red on hover and is clickable
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RoomPage = () => {
  const pathname = usePathname(); // Get the current path
  const [roomData, setRoomData] = useState<any>(null);
  const [membersData, setMembersData] = useState<any[]>([]); // Store member details

  useEffect(() => {
    const roomId = pathname.split("/").pop(); // Extract roomId from the URL path

    const fetchRoomData = async () => {
      if (!roomId) return;

      try {
        const roomRef = doc(db, "rooms", roomId as string);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const roomInfo = roomSnap.data();
          setRoomData(roomInfo);

          // Fetch user data for each member
          const memberPromises = roomInfo.members.map(
            async (userId: string) => {
              const userRef = doc(db, "users", userId);
              const userSnap = await getDoc(userRef);
              return userSnap.exists() ? { userId, ...userSnap.data() } : null;
            }
          );

          const memberDetails = (await Promise.all(memberPromises)).filter(
            Boolean
          );
          setMembersData(memberDetails);
        } else {
          console.error("Room not found");
        }
      } catch (error) {
        console.error("Error fetching room data: ", error);
      }
    };

    fetchRoomData();
  }, [pathname]);

  if (!roomData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen bg-[#1e0e4b] flex flex-col items-center justify-between p-4 relative">
      {/* Top middle room name */}
      <div className="text-white text-4xl font-bold mb-4 absolute top-4">
        {roomData.roomName}
      </div>

      {/* Main content area */}
      <div className="bg-[#a080ff] h-4/5 w-4/5 rounded-3xl flex items-center justify-center relative">
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
  );
};

export default RoomPage;
