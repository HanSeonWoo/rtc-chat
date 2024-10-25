# WebRTC 화상 채팅 앱

React Native와 WebRTC를 활용한 실시간 화상 채팅 애플리케이션입니다.

## 설명 영상

## 프로젝트 간략한 설명 영상

https://github.com/user-attachments/assets/cc11aa8d-0c62-49ad-a3b7-fec6f38b0694

## web-rtc 데모 영상

[![RTC Admin 데모](https://img.youtube.com/vi/w1p5gmj5_FY/0.jpg)](https://www.youtube.com/watch?v=w1p5gmj5_FY)

## 기술 스택

- **프레임워크**: React Native, Expo
- **상태 관리**: Jotai
- **UI 컴포넌트**:
  - @gorhom/bottom-sheet
  - react-native-modal
- **채팅 및 시그널링**: socket.io
- **WebRTC**: react-native-webrtc

## 시작하기

### 패키지 설치

```bash
yarn install
```

### 기기 구동

테스트를 위해서 2대 이상의 기기가 필요합니다.

테스트에는 ios Simulator 3대를 사용합니다

```bash
# ios simulator 기기 목록 확인
xcrun simctl list devices
```

위 목록의 device-udid를 참고해서 원하는 디바이스를 실행시킵니다

```
-- iOS 17.5 --
    iPhone SE (3rd generation) (21A21594-94EA-414B-8F81-5D1ACACB9A26) (Shutdown)
    iPhone 15 (DC748D17-A989-4492-9E5E-72DC5F4EBFAC) (Shutdown)
    iPhone 15 Plus (1F2D2757-8E64-47D3-97E4-92522CF8FF50) (Shutdown)
    iPhone 15 Pro (CCDF40D6-318A-491F-AA2B-C19116D78A18) (Shutdown)
    iPhone 15 Pro Max (C7BE61B9-4E40-4088-9FF6-57B306735070) (Shutdown)
```

```bash
# npx expo run:ios -d <device-udid>

# iPhone SE (3rd generation)
npx expo run:ios -d 21A21594-94EA-414B-8F81-5D1ACACB9A26

# iPhone 15
npx expo run:ios -d DC748D17-A989-4492-9E5E-72DC5F4EBFAC

# iPhone 15 Pro
npx expo run:ios -d CCDF40D6-318A-491F-AA2B-C19116D78A18
```

## 화면 구성

### 1. 사용자 이름 입력 (`app/index.tsx`)

- 앱 실행 시 사용자 이름 입력
- 입력된 이름은 전역 상태로 관리

### 2. 사용자 목록 (`app/user-list.tsx`)

- 접속 중인 사용자 목록 표시
- 각 사용자와 통화 시작 가능

### 3. 통화 화면 (`app/call.tsx`)

- 화상 통화 인터페이스
- 실시간 채팅 기능
- admin message 수신 기능

## WebRTC 구현

WebRTC 연결은 `usePeer` 훅을 통해 관리됩니다. (`hooks/usePeer.ts`):

```typescript
const usePeer = () => {
  // 상태 관리
  const [peer, setPeer] = useAtom(peerAtom);
  const [localStream, setLocalStream] = useAtom(localStreamAtom);
  const [remoteStream, setRemoteStream] = useAtom(remoteStreamAtom);

  // 시그널링 핸들러
  const handleReceiveOffer = async (offer) => { ... }
  const handleReceiveAnswer = async (answer) => { ... }
  const handleRecevieIce = async (iceCandidate) => { ... }

  // 통화 제어
  const startCall = async (calleeName) => { ... }
  const cleanupPeer = () => { ... }
}
```

### 시그널링 프로세스

1. Caller가 `startCall` 호출
2. Offer 생성 및 전송 (SDP)
3. Callee가 Answer 생성 및 전송 (SDP)
4. ICE candidate 교환
5. P2P 연결 수립

## 주요 컴포넌트

### UserItem

- 사용자 목록의 각 항목 표시
- 사용자 상태 및 통화 시작 버튼 포함

### Chat

- 실시간 채팅 인터페이스
- Bottom Sheet로 구현

### AdminMessageModal

- 관리자 메시지 표시
- 5초 후 자동 닫힘

## 상태 관리

Jotai를 사용하여 다음 상태들을 관리합니다:

- 사용자 이름
- WebRTC 연결 상태
- 스트림 상태 (로컬/리모트)
- 소켓 연결
