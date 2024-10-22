import { socketAtom } from "@/atoms/atoms";
import {
  connectionStateAtom,
  localStreamAtom,
  mediaConstraints,
  peerAtom,
  peerConstraints,
  remoteStreamAtom,
  sessionConstraints,
} from "@/atoms/webrtc";
import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";

import { RTCIceCandidate } from "react-native-webrtc/lib/typescript";
import RTCIceCandidateEvent from "react-native-webrtc/lib/typescript/RTCIceCandidateEvent";
import { RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";
import RTCTrackEvent from "react-native-webrtc/lib/typescript/RTCTrackEvent";

export const usePeer = () => {
  const [peer, setPeer] = useAtom(peerAtom);
  const [localStream, setLocalStream] = useAtom(localStreamAtom);
  const [remoteStream, setRemoteStream] = useAtom(remoteStreamAtom);
  const [connectionState, setConnectionState] = useAtom(connectionStateAtom);

  const [socket] = useAtom(socketAtom);

  const handleReceiveOffer = async (offer: RTCSessionDescriptionInit) => {
    const offerDescription = new RTCSessionDescription(offer);
    peer.setRemoteDescription(offerDescription);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer", answer);
  };

  const handleReceiveAnswer = async (answer: RTCSessionDescriptionInit) => {
    const answerDescription = new RTCSessionDescription(answer);
    await peer.setRemoteDescription(answerDescription);
  };

  const handleRecevieIce = async (iceCandidate: RTCIceCandidate) => {
    try {
      await peer.addIceCandidate(iceCandidate);
    } catch (e) {
      console.error("Error adding received ice candidate", e);
    }
  };

  const handleAddIce = (event: RTCIceCandidateEvent<"icecandidate">) => {
    if (event.candidate) {
      socket.emit("ice", event.candidate);
    }
  };

  const handleAddTrack = async (event: RTCTrackEvent<"track">) => {
    const [remoteStream] = event.streams;
    setRemoteStream(remoteStream);
  };

  const handleConnectionChange = () => {
    setConnectionState(peer.connectionState);

    if (["disconnected", "failed", "closed"].includes(peer.connectionState)) {
      cleanupPeer();
    }
  };

  const startCall = async (calleeName: string) => {
    const offer = await peer.createOffer(sessionConstraints);
    await peer.setLocalDescription(offer);

    socket.emit("offer", { to: calleeName, offer });
  };

  const cleanupPeer = () => {
    if (peer) {
      peer.close();
      setPeer(new RTCPeerConnection(peerConstraints));
      setLocalStream(null);
      setRemoteStream(null);
      setConnectionState("new");
    }
  };

  useEffect(() => {
    mediaDevices.getUserMedia(mediaConstraints).then((mediaStream) => {
      mediaStream.getTracks().forEach((track) => {
        console.log("🚀 ~ .forEach ~ track:", track.kind);
        peer.addTrack(track, mediaStream);
      });
      setLocalStream(mediaStream);
    });

    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice", handleRecevieIce);
    peer.addEventListener("icecandidate", handleAddIce);
    peer.addEventListener("connectionstatechange", handleConnectionChange);
    peer.addEventListener("track", handleAddTrack);

    return () => {
      socket.off("offer", handleReceiveOffer);
      socket.off("answer", handleReceiveAnswer);
      socket.off("ice", handleRecevieIce);
      peer.removeEventListener("icecandidate", handleAddIce);
      peer.removeEventListener("connectionstatechange", handleConnectionChange);
      peer.removeEventListener("track", handleAddTrack);
    };
  }, [peer, socket]);

  return {
    startCall,
    peer,
    connectionState,
    localStream,
    remoteStream,
    cleanupPeer,
  };
};
