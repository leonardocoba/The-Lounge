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

// Create a provider component
export const WebRTCProvider = ({ children }: { children: ReactNode }) => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStreamState] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStreamState] = useState<MediaStream | null>(
    null
  );

  // Initialize peer connection
  const setupPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(servers);
    setPc(peerConnection);
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
