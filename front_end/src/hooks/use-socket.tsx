import { useEffect, useMemo } from "react";
import { connect } from "socket.io-client";
// import { WS_ORIGIN } from "../api";

const WS_ORIGIN = "";

export function useSocket() {
  const socket = useMemo(() => connect(WS_ORIGIN), []);
  useEffect(() => {
    return () => {
      socket.close();
    };
  }, [socket]);
}
