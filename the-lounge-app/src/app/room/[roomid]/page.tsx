"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import RoomLayout from "../../components/RoomLayout";

const RoomPage = () => {
  const pathname = usePathname(); // Get the current path
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    const roomId = pathname.split("/").pop(); // Extract roomId from the URL path

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
  }, [pathname]);

  if (!roomData) {
    return <div>Loading...</div>;
  }

  return (
    <RoomLayout>
      <div>
        <h1>{roomData.roomName}</h1>
        <p>Owner: {roomData.owner}</p>
        {/* Add draggable elements, chat, etc. */}
      </div>
    </RoomLayout>
  );
};

export default RoomPage;
