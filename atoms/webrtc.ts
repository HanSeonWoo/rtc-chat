import { atom } from "jotai";
import { MediaStream, RTCPeerConnection } from "react-native-webrtc";

export const peerConstraints = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: [
        "turn:eu-0.turn.peerjs.com:3478",
        "turn:us-0.turn.peerjs.com:3478",
      ],
      username: "peerjs",
      credential: "peerjsp",
    },
  ],
  sdpSemantics: "unified-plan",
};

export const sessionConstraints = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true,
  VoiceActivityDetection: true,
};

export const mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: "user",
  },
};

export const peerAtom = atom<RTCPeerConnection>(
  new RTCPeerConnection(peerConstraints)
);
export const localStreamAtom = atom<MediaStream | null>(null);
export const remoteStreamAtom = atom<MediaStream | null>(null);
export const connectionStateAtom = atom<RTCPeerConnectionState>("new");
