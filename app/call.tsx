import { usePeer } from "@/hooks/usePeer";
import React from "react";
import { Text, View } from "react-native";
import { RTCView } from "react-native-webrtc";

export default function Call() {
  const { peer, localStream, remoteStream } = usePeer();
  // Admin Message 구독 ->

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>통화 페이지</Text>

      <View style={{ borderWidth: 1, padding: 4, marginTop: 8 }}>
        <RTCView
          mirror={true}
          objectFit={"cover"}
          streamURL={localStream?.toURL()}
          zOrder={0}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View style={{ borderWidth: 1, padding: 4, marginTop: 8 }}>
        <RTCView
          objectFit={"cover"}
          streamURL={remoteStream?.toURL()}
          zOrder={0}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </View>
  );
}
