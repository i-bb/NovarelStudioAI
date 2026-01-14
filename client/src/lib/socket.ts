import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let sessionId: string | null = null;

function startHeartbeat() {
  stopHeartbeat();

  heartbeatTimer = setInterval(() => {
    if (!socket || !sessionId) return;

    socket.emit("heartbeat", {
      session_id: sessionId,
      timestamp: Date.now(),
    });

    // optional debug
    console.log("[socket] heartbeat sent");
  }, 30000); // ✅ 5 seconds
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

export function getSocket() {
  if (socket) return socket;

  const token = localStorage.getItem("auth_token");

  socket = io("https://kora-undeluding-nathanael.ngrok-free.dev/ws", {
    auth: { token },
    transports: ["websocket", "polling"],
    timeout: 30000,
    reconnection: true,
    forceNew: true,
  });

  // ---- core socket lifecycle ----

  socket.on("connect", () => {
    console.log("[socket] connected:", socket!.id);
  });

  socket.on("connected", (data: { session_id: string }) => {
    console.log("[socket] authenticated, session:", data.session_id);
    sessionId = data.session_id;
    startHeartbeat(); // ✅ start here
  });

  socket.on("disconnect", (reason) => {
    console.warn("[socket] disconnected:", reason);
    sessionId = null;
    stopHeartbeat(); // ✅ stop here
  });

  socket.on("connect_error", (err) => {
    console.error("[socket] connect_error:", err.message);
    sessionId = null;
    stopHeartbeat();
  });

  socket.on("heartbeat_ack", (data) => {
    console.log("Heartbeat Acknowledgment:", data);
  });

  socket.on("heartbeat_timeout", () => {
    console.error("[socket] heartbeat timeout");
    sessionId = null;
    stopHeartbeat();
  });

  return socket;
}
