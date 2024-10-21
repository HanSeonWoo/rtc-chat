import React from "react";
import { Text, View, FlatList } from "react-native";
import { useAtom } from "jotai";
import { userNameAtom } from "./atoms";

export default function UserList() {
  const [userName] = useAtom(userNameAtom);

  // PeerJs - new Peer를 해준 뒤
  // socket.io로 연결 시도
  // -> 통화 가능한 유저의 리스트(생성되어 있는 Peer들)를 보여줌

  const users: { id: string; name: string }[] = []; // 서버에서 받아온 사용자 목록을 저장할 배열

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>안녕하세요, {userName}님!</Text>
      <Text>통화 가능한 사용자 목록:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
