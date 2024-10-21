import React, { useState } from "react";
import { Text, View, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { userNameAtom } from "./atoms";

export default function Index() {
  const [name, setName] = useState("");
  const [_, setUserName] = useAtom(userNameAtom);
  const router = useRouter();

  const handleSubmit = () => {
    if (name && name.trim()) {
      setUserName(name);

      // userName 서버에 중복 확인 후 화면 이동.
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
