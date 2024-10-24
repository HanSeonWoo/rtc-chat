import { UserItem } from "@/components/UserItem";
import { usePeer } from "@/hooks/usePeer";
import { router } from "expo-router";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { socketAtom, userNameAtom } from "../atoms/atoms";

export default function UserList() {
  const [userName] = useAtom(userNameAtom);
  const [socket] = useAtom(socketAtom);
  const [userList, setUserList] = useState<string[]>([]);
  const { startCall, connectionState } = usePeer();

  const filteredUsers = useMemo(() => {
    return userList.filter((user) => user !== userName);
  }, [userList]);

  const handleUserUpdate = (users: string[]) => {
    console.log("handleUserUpdate", users);
    setUserList(users);
  };

  useEffect(() => {
    if (connectionState === "connected") {
      router.replace("/call");
    }
  }, [connectionState]);

  useEffect(() => {
    socket.emit("waiting", userName);
    socket.on("userUpdate", handleUserUpdate);

    return () => {
      socket.off("userUpdate", handleUserUpdate);
    };
  }, []);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>현재 접속한 사용자가 없습니다</Text>
      <Text style={styles.emptySubText}>잠시 후 다시 시도해주세요</Text>
    </View>
  );

  const renderItem: ListRenderItem<string> = useCallback(
    ({ item }) => <UserItem onStartCall={startCall} username={item} />,
    [userName]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>안녕하세요,</Text>
        <Text style={styles.userName}>{userName}님!</Text>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>통화 가능한 사용자</Text>

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});
