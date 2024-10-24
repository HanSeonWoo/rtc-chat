import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Avatar } from "./Avatar";

interface UserItemProps {
  username: string;
  onStartCall: (username: string) => void;
  status?: string;
  avatarSize?: number;
}

export const UserItem = React.memo(
  ({
    username,
    onStartCall,
    status = "통화 가능",
    avatarSize = 48,
  }: UserItemProps) => {
    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => onStartCall(username)}
        activeOpacity={0.7}
      >
        <Avatar name={username} size={avatarSize} />
        <View style={styles.userInfo}>
          <Text style={styles.userNameText}>{username}</Text>
          <Text
            style={[
              styles.statusText,
              status !== "통화 가능" && styles.statusTextBusy,
            ]}
          >
            {status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusText: {
    fontSize: 14,
    color: "#00B057",
    marginTop: 2,
  },
  statusTextBusy: {
    color: "#FF6B6B",
  },
});
