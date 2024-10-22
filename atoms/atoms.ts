import { atom } from "jotai";
import io from "socket.io-client";
export const userNameAtom = atom<string | null>(null);

export const socketAtom = atom(() => {
  const socket = io("http://localhost:3000");
  return socket;
});
