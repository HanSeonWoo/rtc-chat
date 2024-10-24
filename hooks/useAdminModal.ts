import { socketAtom } from "@/atoms/atoms";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export const useAdminModal = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [adminMessage, setAdminMessage] = useState<string>("");
  const [socket] = useAtom(socketAtom);

  useEffect(() => {
    socket.on("adminMessage", (message) => {
      console.log("🚀 ~ socket.on ~ message:", message);
      setAdminMessage(message);
      setModalVisible(true);
    });

    return () => {
      socket.off("adminMessage");
    };
  }, [socket]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    modalVisible,
    adminMessage,
    handleCloseModal,
  };
};
