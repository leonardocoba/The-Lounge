import { createWorker } from "mediasoup";
import { NextApiRequest, NextApiResponse } from "next";
import {
  Worker,
  Router,
  RtpCodecCapability,
  RtpCapabilities,
  WebRtcTransport,
} from "mediasoup/node/lib/types";

let worker: Worker;
let router: Router;

const mediaCodecs: RtpCodecCapability[] = [
  {
    kind: "audio", // MediaKind: "audio" or "video"
    mimeType: "audio/opus", // Codec MIME type
    clockRate: 48000, // Codec clock rate in Hz
    channels: 2, // Number of channels, specific to audio codecs
    rtcpFeedback: [], // Optional RTCP feedback, leave empty or add appropriate feedback
    parameters: {}, // Codec-specific parameters
  },
  {
    kind: "video", // MediaKind: "audio" or "video"
    mimeType: "video/VP8", // Codec MIME type for video
    clockRate: 90000, // Codec clock rate for video
    rtcpFeedback: [], // Optional RTCP feedback
    parameters: {}, // Codec-specific parameters
  },
];

async function createMediasoupWorker() {
  if (!worker) {
    worker = await createWorker({
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
    });

    router = await worker.createRouter({ mediaCodecs });

    worker.on("died", () => {
      console.error("Mediasoup worker has died.");
      process.exit(1);
    });

    console.log("Mediasoup worker and router created.");
  }
}

// Handler for API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await createMediasoupWorker();
    res.status(200).json({ message: "Mediasoup worker started." });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

export async function createWebRtcTransport() {
  if (!router) {
    throw new Error("Router not created yet.");
  }

  const transport: WebRtcTransport = await router.createWebRtcTransport({
    listenIps: [
      {
        ip: process.env.NEXT_PUBLIC_MEDIASOUP_IP || "127.0.0.1",
        announcedIp:
          process.env.NEXT_PUBLIC_MEDIASOUP_ANNOUNCED_IP || "127.0.0.1", // Default to localhost in dev
      },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true, // Prefer UDP for performance reasons
  });

  console.log("WebRTC Transport created with ID:", transport.id);
  return transport;
}
