import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { userNameAtom } from "../atoms/atoms";

export default function Index() {
  const [name, setName] = useState("");
  const [_, setUserName] = useAtom(userNameAtom);
  const router = useRouter();

  const handleSubmit = () => {
    if (name && name.trim()) {
      setUserName(name);

      router.replace("/user-list");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>사용자 이름을 입력하세요:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, width: 200, marginVertical: 10 }}
      />
      <Button title="다음" onPress={handleSubmit} />
    </View>
  );
}
