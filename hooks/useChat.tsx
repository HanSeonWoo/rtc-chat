import { socketAtom } from "@/atoms/atoms";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useAtom } from "jotai";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface Returns {
  isChatOpen: boolean;
  unreadMessages: number;
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  chatOpen: () => void;
  chatClose: () => void;
  handleSheetChanges: (index: number) => void;
  renderBackdrop: (props: BottomSheetBackdropProps) => React.JSX.Element;
}

export const useChat = (): Returns => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [socket] = useAtom(socketAtom);

  const handleSheetChanges = useCallback((index: number) => {
    setIsChatOpen(index !== -1);
  }, []);

  const chatOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsChatOpen(true);
  }, []);

  const chatClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsChatOpen(false);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={chatClose}
      />
    ),
    []
  );

  useEffect(() => {
    const handleUnread = () => {
      setUnreadMessages((prev) => prev + 1);
    };

    if (!isChatOpen) {
      socket.on("chat", handleUnread);
    } else {
      setUnreadMessages(0);
    }

    return () => {
      socket.off("chat", handleUnread);
    };
  }, [socket, isChatOpen]);

  return {
    isChatOpen,
    unreadMessages,
    bottomSheetRef,
    chatOpen,
    chatClose,
    handleSheetChanges,
    renderBackdrop,
  };
};
