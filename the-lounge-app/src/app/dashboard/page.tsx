"use client";
import { useState, useEffect } from "react";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import Draggable from "react-draggable";
import { db, auth } from "../lib/firebase"; // Firestore and Auth import
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth"; // Auth state hook
import {
  collection,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore"; // Firestore imports

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState(""); // New state for inputting room ID
  const [rooms, setRooms] = useState<any[]>([]); // Stores room details
  const [user] = useAuthState(auth); // Get the currently logged-in user

  // Function to fetch joined rooms
  const fetchJoinedRooms = async () => {
    if (!user) return;

    try {
      // Get the user's document
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const { joinedRooms } = userDoc.data();

        // Fetch the details for each joined room
        const roomPromises = joinedRooms.map(async (roomId: string) => {
          const roomDocRef = doc(db, "rooms", roomId);
          const roomDoc = await getDoc(roomDocRef);
          return roomDoc.exists()
            ? { id: roomDoc.id, ...roomDoc.data() }
            : null;
        });

        const roomDetails = (await Promise.all(roomPromises)).filter(Boolean);
        setRooms(roomDetails);
      }
    } catch (error) {
      console.error("Error fetching joined rooms: ", error);
    }
  };

  useEffect(() => {
    fetchJoinedRooms();
  }, [user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const createRoomInFirestore = async (roomName: string) => {
    if (!user) return;

    try {
      // Create a new room document in the "rooms" collection
      const roomRef = await addDoc(collection(db, "rooms"), {
        owner: user.uid,
        roomName: roomName,
        members: [user.uid],
        isPrivate: true,
        createdAt: serverTimestamp(),
      });

      // Add the room creator to the roomMembers subcollection with "admin" role
      await setDoc(doc(roomRef, "roomMembers", user.uid), {
        userId: user.uid,
        role: "admin",
        joinedAt: serverTimestamp(),
      });

      // Add the room ID to the user's ownedRooms and joinedRooms arrays in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        ownedRooms: arrayUnion(roomRef.id),
        joinedRooms: arrayUnion(roomRef.id),
      });

      // Add the new room to the rooms state
      setRooms((prevRooms) => [...prevRooms, { id: roomRef.id, roomName }]);

      console.log("Room created with ID: ", roomRef.id);
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  const createRoom = () => {
    if (roomName.trim() !== "") {
      createRoomInFirestore(roomName);
      setRoomName("");
      setIsModalOpen(false);
    }
  };

  // Function to join a room using room ID
  const joinRoom = async () => {
    if (!user || roomId.trim() === "") return;

    try {
      const roomRef = doc(db, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);

      if (roomDoc.exists()) {
        // Add the user to the roomMembers subcollection of the room
        await setDoc(doc(roomRef, "roomMembers", user.uid), {
          userId: user.uid,
          role: "member", // Assuming the role is "member" by default
          joinedAt: serverTimestamp(),
        });

        // Add the room ID to the user's joinedRooms array in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          joinedRooms: arrayUnion(roomId),
        });

        console.log(`User added to room with ID: ${roomId}`);

        // Refetch joined rooms to display the newly joined room
        await fetchJoinedRooms();

        setIsSearchModalOpen(false); // Close the search modal after joining
      } else {
        console.error("Room does not exist");
      }
    } catch (error) {
      console.error("Error joining room: ", error);
    }
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
          <button
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none"
            onClick={openSearchModal}
          >
            <SearchIcon className="text-gray-300" fontSize="large" />
          </button>

          <SettingsIcon className="text-gray-300" fontSize="large" />
        </div>

        {/* Right Square with more rounded corners and draggable circles */}
        <div className="bg-[#a080ff] h-4/5 w-[85%] rounded-3xl flex-shrink-0 relative overflow-hidden">
          {rooms.map((room, index) => (
            <Draggable key={room.id} bounds="parent">
              <div
                className="bg-white text-center text-black flex items-center justify-center rounded-full"
                style={{
                  width: "150px",
                  height: "150px",
                  position: "absolute",
                  top: `${index * 20 + 10}%`,
                  left: `${index * 20 + 10}%`,
                  cursor: "pointer",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent click propagation
              >
                <Link href={`/room/${room.id}`} passHref>
                  {room.roomName}
                </Link>
              </div>
            </Draggable>
          ))}
        </div>
      </div>

      {/* Create Room Modal Pop-Up */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-lg w-[400px]">
            <h2 className="text-2xl font-bold text-center mb-4">
              Create A Room
            </h2>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mr-4"
                onClick={createRoom}
              >
                Create
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal Pop-Up */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-lg w-[400px]">
            <h2 className="text-2xl font-bold text-center mb-4">Join a Room</h2>
            <input
              type="text"
              placeholder="Input room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mr-4"
                onClick={joinRoom} // Trigger the joinRoom function
              >
                Join
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                onClick={closeSearchModal}
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
