import React from "react";
import { Stack } from "expo-router";
import { useAtom, Provider } from "jotai";
import { userNameAtom } from "../atoms/atoms";

export default function RootLayout() {
  const [userName] = useAtom(userNameAtom);

  return (
    <Provider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "시작 페이지" }} />
        <Stack.Screen
          name="user-list"
          options={{ title: "사용자 목록", animation: "fade" }}
        />
        <Stack.Screen name="call" options={{ title: "통화" }} />
      </Stack>
    </Provider>
  );
}
