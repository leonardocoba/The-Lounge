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
import { useWebRTC } from "@/app/context/WebRTCContext";
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
  const cameraRef = useRef<HTMLButtonElement>(null);
  const micRef = useRef<HTMLButtonElement>(null);
  const {
    pc,
    localStream,
    remoteStream,
    setupPeerConnection,
    setLocalStream,
    setRemoteStream,
  } = useWebRTC();

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

  useEffect(() => {
    const setupCall = async () => {
      const roomId = pathname.split("/").pop(); // Get room ID
      console.log("Room ID:", roomId);
      if (!roomId) {
        console.error("Room ID not available");
        return;
      }

      if (!pc) {
        setupPeerConnection();
      }
      if (!pc) {
        console.error("PeerConnection is not initialized");
        return;
      }
      // Get local media stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      } catch (error) {
        console.error("Error accessing media devices:", error);
        return;
      }

      // Check for existing offer
      const callRef = doc(db, "calls", roomId);
      const callSnapshot = await getDoc(callRef);
      console.log("Call Snapshot:", callSnapshot.data());

      if (callSnapshot.exists()) {
        const callData = callSnapshot.data();
        if (callData.offer) {
          console.log("Offer exists, creating answer");
          await pc.setRemoteDescription(
            new RTCSessionDescription(callData.offer)
          );
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await setDoc(callRef, { answer }, { merge: true });
        }
      } else {
        console.log("No offer exists, creating offer");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await setDoc(callRef, { offer });
      }

      // Firestore real-time listener for remote answer
      const unsubscribe = onSnapshot(callRef, (snapshot) => {
        const data = snapshot.data();
        console.log("onSnapshot data:", data);
        if (data?.answer && !pc.currentRemoteDescription) {
          pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      });

      // Handle ICE candidate exchange
      pc.addEventListener("icecandidate", async (event) => {
        if (event.candidate) {
          const candidateRef = collection(db, "calls", roomId, "candidates");
          await addDoc(candidateRef, { candidate: event.candidate });
        }
      });

      onSnapshot(collection(db, "calls", roomId, "candidates"), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data().candidate);
            pc.addIceCandidate(candidate);
          }
        });
      });

      return () => unsubscribe();
    };

    setupCall();
  }, [pc, pathname, setupPeerConnection, setLocalStream, setRemoteStream]);

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
              ref={cameraRef}
              onClick={handleCameraClick}
              className={`text-white p-2 rounded-full transition-colors shadow-md ${
                cameraOn ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500"
              }`}
            >
              <CameraAltIcon />
            </button>
            <button
              ref={micRef}
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
