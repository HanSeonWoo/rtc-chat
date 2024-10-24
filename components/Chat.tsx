import { socketAtom, userNameAtom } from "@/atoms/atoms";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet } from "react-native";
import ChatInputFooter from "./ChatInput";
import { ChatMessage, ChatMessageItem } from "./ChatMessageItem";

export default function Chat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const [userName] = useAtom(userNameAtom);
  const [socket] = useAtom(socketAtom);

  useEffect(() => {
    const handleChat = (newMessage: ChatMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    };

    socket.on("chat", handleChat);
    return () => {
      socket.off("chat", handleChat);
    };
  }, [socket]);

  const renderItem: ListRenderItem<ChatMessage> = useCallback(
    ({ item }) => (
      <ChatMessageItem message={item} currentUserName={userName || ""} />
    ),
    [userName]
  );

  return (
    <BottomSheetView style={styles.contentContainer}>
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(chat) => chat.timestamp.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 8,
          paddingBottom: 20,
        }}
        onContentSizeChange={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd();
          }, 100);
        }}
      />
      <ChatInputFooter />
    </BottomSheetView>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  messageBox: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "purple",
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ddd",
    borderBottomLeftRadius: 4,
  },
  sender: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: "white",
  },
  otherMessageText: {
    color: "black",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
