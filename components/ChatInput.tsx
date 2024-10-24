import { socketAtom, userNameAtom } from "@/atoms/atoms";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";
import { memo, useCallback, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatInputFooter = memo(() => {
  const [message, setMessage] = useState("");
  const [userName] = useAtom(userNameAtom);
  const [socket] = useAtom(socketAtom);

  const sendMessage = useCallback(() => {
    if (message) {
      socket.emit("chat", {
        from: userName,
        message: message.trim(),
        timestamp: new Date(),
      });
      setMessage("");
    }
  }, [message, userName, socket]);

  return (
    <View style={footerStyles.container}>
      <View style={footerStyles.inputContainer}>
        <BottomSheetTextInput
          style={footerStyles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="메시지를 입력하세요"
          multiline
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={footerStyles.sendButton} onPress={sendMessage}>
          <Text style={footerStyles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default ChatInputFooter;

const footerStyles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
