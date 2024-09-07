import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the shape of the context
interface WebRTCContextProps {
  pc: RTCPeerConnection | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  setupPeerConnection: () => void;
  setLocalStream: (stream: MediaStream) => void;
  setRemoteStream: (stream: MediaStream) => void;
}

// Create the context
const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

// Define the ICE server configuration
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const WebRTCProvider = ({ children }: { children: ReactNode }) => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStreamState] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStreamState] = useState<MediaStream | null>(
    null
  );

  // Initialize peer connection
  const setupPeerConnection = () => {
    // Define ICE server configurations
    const configuration = {
      iceServers: [
        {
          urls: [
            "stun:stun1.1.google.com:19302",
            "stun:stun2.1.google.com:19302",
          ],
        },
      ],
    };

    // Create a new RTCPeerConnection instance
    const peerConnection = new RTCPeerConnection(configuration);

    // Add event listeners for ICE candidate and track events
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
        // Send the candidate to the remote peer via signaling
      }
    };

    peerConnection.ontrack = (event) => {
      console.log("Received remote track:", event.streams[0]);
      // You can set this as the remote stream (use state or context)
      setRemoteStream(event.streams[0]);
    };

    // Set the peer connection in the state
    setPc(peerConnection);
    console.log("PeerConnection initialized:", peerConnection);
  };

  // Set local stream
  const setLocalStream = (stream: MediaStream) => {
    setLocalStreamState(stream);
  };

  // Set remote stream
  const setRemoteStream = (stream: MediaStream) => {
    setRemoteStreamState(stream);
  };

  // Effect to clean up the peer connection when the component is unmounted
  useEffect(() => {
    return () => {
      if (pc) {
        pc.close();
      }
    };
  }, [pc]);

  return (
    <WebRTCContext.Provider
      value={{
        pc,
        localStream,
        remoteStream,
        setupPeerConnection,
        setLocalStream,
        setRemoteStream,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

// Custom hook to use WebRTCContext in other components
export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (context === undefined) {
    throw new Error("useWebRTC must be used within a WebRTCProvider");
  }
  return context;
};
