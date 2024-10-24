import { atom } from "jotai";
import io from "socket.io-client";
export const userNameAtom = atom<string | null>(null);

export const socketAtom = atom(() => {
  const socket = io("https://available-imojean-kahel-82da46e8.koyeb.app");
  return socket;
});
