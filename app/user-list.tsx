import { usePeer } from "@/hooks/usePeer";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { socketAtom, userNameAtom } from "../atoms/atoms";
import { RTCView, mediaDevices, MediaStream } from "react-native-webrtc";

let mediaConstraints = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: "user",
  },
};

export default function UserList() {
  const [userName] = useAtom(userNameAtom);
  const [userList, setUserList] = useState<string[]>([]);
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(
    null
  );
  const [socket] = useAtom(socketAtom);
  const { peer, makeCall, connectionState } = usePeer(userName!);

  const handleUserUpdate = (users: string[]) => {
    console.log("handleUserUpdate", users);
    setUserList(users);
  };

  useEffect(() => {
    console.log("connectionState", connectionState);
    if (connectionState === "connected") {
      mediaDevices.getUserMedia(mediaConstraints).then((mediaStream) => {
        console.log("getUserMedimed", mediaStream);
        setLocalMediaStream(mediaStream);
      });
    }
  }, [connectionState]);

  useEffect(() => {
    socket.emit("wating", userName);
    console.log("emit wating", userName);

    socket.on("userUpdate", handleUserUpdate);
    return () => {
      socket.off("userUpdate", handleUserUpdate);
    };
  }, []);
  // PeerJs - new Peer를 해준 뒤
  // socket.io로 연결 시도
  // -> 통화 가능한 유저의 리스트(생성되어 있는 Peer들)를 보여줌

  const filteredUsers = useMemo(() => {
    return userList.filter((user) => user !== userName);
  }, [userList]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>안녕하세요, {userName}님!</Text>
      <Text>통화 가능한 사용자 목록:</Text>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ borderWidth: 0.5, padding: 12, borderRadius: 8 }}
            onPress={() => makeCall(item)}
          >
            <Text>user name: {item}</Text>
          </TouchableOpacity>
        )}
      />
      {localMediaStream && (
        <View style={{ borderWidth: 1, padding: 4, marginTop: 8 }}>
          <RTCView
            mirror={true}
            objectFit={"cover"}
            streamURL={localMediaStream.toURL()}
            zOrder={0}
          />
        </View>
      )}
    </View>
  );
}
