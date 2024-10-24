import { AdminMessageModal } from "@/components/AdminMessageModal";
import Chat from "@/components/Chat";
import { useAdminModal } from "@/hooks/useAdminModal";
import { useChat } from "@/hooks/useChat";
import { usePeer } from "@/hooks/usePeer";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  Volume2,
  VolumeOff,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RTCView } from "react-native-webrtc";

const { width, height } = Dimensions.get("window");

export default function Call() {
  const { connectionState, localStream, remoteStream, cleanupPeer } = usePeer();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const {
    unreadMessages,
    bottomSheetRef,
    chatOpen,
    renderBackdrop,
    handleSheetChanges,
  } = useChat();
  const { adminMessage, handleCloseModal, modalVisible } = useAdminModal();
  console.log("🚀 ~ Call ~ adminMessage:", adminMessage);

  const handleMuteToggle = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const handleSpeakerToggle = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // TODO: incall-manager 추가 필요
  };

  // 통화 종료
  const handleEndCall = useCallback(() => {
    cleanupPeer();
    router.replace("/user-list");
  }, [cleanupPeer, router]);

  useEffect(() => {
    if (connectionState === "disconnected") {
      handleEndCall();
    }
  }, [connectionState, handleEndCall]);

  return (
    <View style={styles.container}>
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          objectFit="cover"
          style={styles.remoteStream}
        />
      )}

      <View style={styles.topControls}>
        <View style={styles.localStreamContainer}>
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()}
              objectFit="cover"
              mirror={true}
              style={styles.localStream}
            />
          )}
        </View>

        <TouchableOpacity style={styles.chatButton} onPress={chatOpen}>
          <MessageCircle color="white" size={24} />
          {unreadMessages > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.smallButton]}
          onPress={handleSpeakerToggle}
        >
          {isSpeakerOn ? (
            <Volume2 color="white" size={24} />
          ) : (
            <VolumeOff color="white" size={24} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Phone
            color="white"
            size={32}
            style={{ transform: [{ rotate: "135deg" }] }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.smallButton]}
          onPress={handleMuteToggle}
        >
          {isMuted ? (
            <MicOff color="white" size={24} />
          ) : (
            <Mic color="white" size={24} />
          )}
        </TouchableOpacity>
      </View>

      {/* 채팅창 BottomSheet */}
      <BottomSheet
        index={-1}
        snapPoints={["50%"]}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
      >
        <Chat />
      </BottomSheet>

      <AdminMessageModal
        isVisible={modalVisible}
        message={adminMessage}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  remoteStream: {
    position: "absolute",
    width,
    height,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
  topControls: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  localStreamContainer: {
    width: 100,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
  },
  localStream: {
    width: "100%",
    height: "100%",
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  controlButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  smallButton: {
    width: 50,
    height: 50,
  },
  endCallButton: {
    width: 70,
    height: 70,
    backgroundColor: "#ff4444",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  placeholderText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
