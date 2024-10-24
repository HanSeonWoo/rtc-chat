import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

interface Props {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export const AdminMessageModal = ({ isVisible, message, onClose }: Props) => {
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        onClose();
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isVisible, onClose]);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      useNativeDriver={true}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>관리자 메시지</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.timer}>5초 후 자동으로 닫힙니다</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 15,
    lineHeight: 22,
  },
  timer: {
    fontSize: 12,
    color: "#999",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
