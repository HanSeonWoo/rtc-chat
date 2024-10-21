import React from "react";
import { Stack } from "expo-router";
import { useAtom } from "jotai";
import { userNameAtom } from "./atoms";

export default function RootLayout() {
  const [userName] = useAtom(userNameAtom);

  return (
    <Stack>
      {userName ? (
        <>
          <Stack.Screen name="user-list" options={{ title: "사용자 목록" }} />
          <Stack.Screen name="call" options={{ title: "통화" }} />
        </>
      ) : (
        <Stack.Screen name="index" options={{ title: "시작 페이지" }} />
      )}
    </Stack>
  );
}
