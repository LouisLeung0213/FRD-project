import { useEffect, useMemo } from "react";
import { connect } from "socket.io-client";
import { WS_ORIGIN } from "../api";

export function useSocket() {
  const socket = useMemo(() => connect(WS_ORIGIN), []);
  useEffect(() => {
    return () => {
      socket.close();
    };
  }, [socket]);
}
