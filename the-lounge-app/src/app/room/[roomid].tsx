"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // Adjust the import path as needed
import RoomLayout from "../components/RoomLayout";

const RoomPage = () => {
  const router = useRouter();
  const { roomId } = router.query; // Extract roomId from the URL
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;

      try {
        const roomRef = doc(db, "rooms", roomId as string);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          setRoomData(roomSnap.data());
        } else {
          console.error("Room not found");
        }
      } catch (error) {
        console.error("Error fetching room data: ", error);
      }
    };

    fetchRoomData();
  }, [roomId]);

  if (!roomData) {
    return <div>Loading...</div>;
  }

  return (
    <RoomLayout>
      <div>
        <h1>{roomData.roomName}</h1>
        {/* Display other room-specific details and interactive features here */}
        <p>Owner: {roomData.owner}</p>
        {/* You can add draggable elements, chat, etc. */}
      </div>
    </RoomLayout>
  );
};

export default RoomPage;
