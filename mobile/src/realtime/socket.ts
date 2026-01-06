import { Platform } from "react-native";

let socket: any = null;

export const getSocket = () => {
  if (Platform.OS === "web") {
    return null; // ❌ no sockets on web
  }

  if (!socket) {
    // ✅ dynamic require (prevents web bundling)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { io } = require("socket.io-client");

    socket = io("http://192.168.1.59:4000", {
      transports: ["websocket"],
      upgrade: false,
      autoConnect: false,
    });
  }

  return socket;
};
