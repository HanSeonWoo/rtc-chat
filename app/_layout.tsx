import { Stack } from "expo-router";
import { Provider as JotaiProvider } from "jotai";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <JotaiProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "시작 페이지" }} />
          <Stack.Screen
            name="user-list"
            options={{ title: "사용자 목록", animation: "fade" }}
          />
          <Stack.Screen
            name="call"
            options={{ headerShown: false, animation: "fade" }}
          />
        </Stack>
      </JotaiProvider>
    </GestureHandlerRootView>
  );
}
