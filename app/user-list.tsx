import { usePeer } from "@/hooks/usePeer";
import { router } from "expo-router";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { socketAtom, userNameAtom } from "../atoms/atoms";

export default function UserList() {
  const [userName] = useAtom(userNameAtom);
  const [socket] = useAtom(socketAtom);
  const [userList, setUserList] = useState<string[]>([]);
  const { peer, startCall, connectionState } = usePeer();

  const filteredUsers = useMemo(() => {
    return userList.filter((user) => user !== userName);
  }, [userList]);

  const handleUserUpdate = (users: string[]) => {
    console.log("handleUserUpdate", users);
    setUserList(users);
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ connectionState:", connectionState);
    if (connectionState === "connected") {
      router.navigate("/call");
    }
  }, [connectionState]);

  useEffect(() => {
    socket.emit("waiting", userName);
    socket.on("userUpdate", handleUserUpdate);

    return () => {
      socket.off("userUpdate", handleUserUpdate);
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>안녕하세요, {userName}님!</Text>
      <Text>통화 가능한 사용자 목록:</Text>
      <FlatList
        data={filteredUsers || []}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ borderWidth: 0.5, padding: 12, borderRadius: 8 }}
            onPress={() => startCall(item)}
          >
            <Text>user name: {item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
