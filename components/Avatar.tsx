import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AvatarProps {
  name: string;
  size?: number;
  backgroundColor?: string;
}

/**
 * 채팅창에서 임시 유저 프로필 아바타
 */
export const Avatar = React.memo(
  ({ name, size = 40, backgroundColor }: AvatarProps) => {
    const initial = name.charAt(0).toUpperCase();

    return (
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 3,
            backgroundColor: backgroundColor || getColorFromName(name),
          },
        ]}
      >
        <Text style={[styles.initial, { fontSize: size * 0.4 }]}>
          {initial}
        </Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  initial: {
    color: "white",
    fontWeight: "bold",
  },
});

const getColorFromName = (name: string) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B59B6",
    "#3498DB",
  ];
  const index = name.length % colors.length;
  return colors[index];
};
