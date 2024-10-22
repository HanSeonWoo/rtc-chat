import { socketAtom } from "@/atoms/atoms";
import { useAtom } from "jotai";
import { useState, useEffect, useRef } from "react";
import { RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";

import { RTCSessionDescriptionInit } from "react-native-webrtc/lib/typescript/RTCSessionDescription";
import { RTCIceCandidate } from "react-native-webrtc/lib/typescript";
import RTCIceCandidateEvent from "react-native-webrtc/lib/typescript/RTCIceCandidateEvent";

const peerConstraints = {
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

const sessionConstraints = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true,
  VoiceActivityDetection: true,
};

// answer받아와서 setRemote 하면 sdp 교환은 끝난거임. 그러면 방을 만들어. 서버에서 랜덤하게 만들고
// send sdpComplete -> from이랑 서버에서 룸이름을 받아와 candidateRoom
// 이거 가지고 iceCandidate생길 때 그 room으로 쏘면 내가 아닌 다른 clinet에게만 가도록 세팅해서 처리 하기

// peer Conneceted가 되는 경우 call 화면으로 이동하면 되는 거임.

export const usePeer = (userName: string) => {
  const [peer] = useState(new RTCPeerConnection(peerConstraints));
  const [iceRoom, setIceRoom] = useState<string | null>(null);
  const [connectionState, setConnectionState] =
    useState<RTCPeerConnectionState>("new");
  const [socket] = useAtom(socketAtom);
  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  // 통화를 받는 경우: offer를 받아와서 setRemote, answer를 만들고 setLoca, answer 보내기
  const handleReceiveOffer = async ({
    from,
    offer,
  }: {
    from: string;
    offer: RTCSessionDescriptionInit;
  }) => {
    const offerDescription = new RTCSessionDescription(offer);
    peer.setRemoteDescription(offerDescription);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("answer", { from: userName, to: from, answer });
  };

  // 통화를 거는 경우: offer만들고 setLocal, offer를 보내고, answer를 받아와서 setRemote
  const handleReceiveAnswer = async ({
    from,
    answer,
  }: {
    from: string;
    answer: RTCSessionDescriptionInit;
  }) => {
    const answerDescription = new RTCSessionDescription(answer);
    await peer.setRemoteDescription(answerDescription);

    socket.emit("sdpDone", { to: from });
  };

  const handleSdpDone = async (iceRoom: string) => {
    console.log("🚀 ~ handleSdpDone ~ iceRoom:", iceRoom);
    setIceRoom(iceRoom);
  };

  const handleRecevieIce = async (iceCandidate: any) => {
    console.log("🚀 ~ handleRecevieIce ~ iceCandidate:", iceCandidate);
    try {
      await peer.addIceCandidate(iceCandidate);
    } catch (e) {
      console.error("Error adding received ice candidate", e);
    }
  };

  const handleAddIce = (event: RTCIceCandidateEvent<"icecandidate">) => {
    console.log("🚀 ~ handleAddIce : ", event.candidate);
    if (event.candidate) {
      if (iceRoom) {
        socket.emit("ice", { iceRoom, candidate: event.candidate });
      } else {
        pendingCandidates.current.push(event.candidate);
      }
    }
  };

  useEffect(() => {
    // icecandidate 이벤트 리스너를 즉시 등록
    peer.addEventListener("icecandidate", handleAddIce);

    return () => {
      peer.removeEventListener("icecandidate", handleAddIce);
    };
  }, [peer]);

  useEffect(() => {
    if (iceRoom && pendingCandidates.current.length > 0) {
      // 대기 중인 ICE Candidate 전송
      pendingCandidates.current.forEach((candidate) => {
        socket.emit("ice", { iceRoom, candidate });
      });
      pendingCandidates.current = [];
    }
  }, [iceRoom]);

  useEffect(() => {
    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice", handleRecevieIce);
    socket.on("sdpDone", handleSdpDone);

    peer.addEventListener("connectionstatechange", (event) => {
      setConnectionState(peer.connectionState);
      if (peer.connectionState === "connected") {
      }
    });

    return () => {
      socket.off("offer", handleReceiveOffer);
      socket.off("answer", handleReceiveAnswer);
      socket.off("ice", handleRecevieIce);
    };
  }, []);

  const makeCall = async (calleeName: string) => {
    const offer = await peer.createOffer(sessionConstraints);
    await peer.setLocalDescription(offer);

    socket.emit("offer", { from: userName, to: calleeName, offer });
  };

  return {
    makeCall,
    peer,
    connectionState,
  };
};
