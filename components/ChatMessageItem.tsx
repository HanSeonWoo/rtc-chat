import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "./Avatar";

export interface ChatMessage {
  from: string;
  message: string;
  timestamp: number;
}

interface Props {
  message: ChatMessage;
  currentUserName: string;
}

export const ChatMessageItem: React.FC<Props> = React.memo(
  ({ message, currentUserName }) => {
    const isMe = message.from === currentUserName;

    return (
      <View style={styles.container}>
        {!isMe && (
          <>
            <Avatar name={message.from} />
            <View style={styles.avatarSpacing} />
          </>
        )}

        <View style={styles.messageContainer}>
          {!isMe && <Text style={styles.sender}>{message.from}</Text>}
          <View
            style={[
              styles.messageBox,
              isMe ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.otherMessageText,
              ]}
            >
              {message.message}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: "row",
  },
  avatarSpacing: {
    width: 8,
  },
  messageContainer: {
    flex: 1,
  },
  sender: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
    marginLeft: 4,
  },
  messageBox: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    alignItems: "flex-end",
  },
  myMessage: {
    backgroundColor: "#0066FF",
    borderBottomRightRadius: 4,
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 4,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 15,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#333333",
  },
  timestamp: {
    fontSize: 11,
    color: "#999999",
    marginTop: 8,
    alignSelf: "flex-end",
  },
});
