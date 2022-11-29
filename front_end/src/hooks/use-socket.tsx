import { useEffect, useMemo, useState } from "react";
import { connect, Socket } from "socket.io-client";
import { WS_ORIGIN } from "../api";

let socket: Socket;

export function useSocket(initFn: (socket: Socket) => () => void) {
  if (!socket) {
    console.log(WS_ORIGIN);
    socket = connect(WS_ORIGIN);
  }

  useEffect(() => {
    let teardown: () => void;
    let isDestroyed = false;

    if (socket.connected) {
      teardown = initFn(socket);
    } else {
      socket.on("connect", () => {
        if (!isDestroyed) {
          teardown = initFn(socket);
        }
      });
    }
    return () => {
      console.log("clean up useSocket");
      isDestroyed = true;
      teardown?.();
    };
  }, [initFn]);

  return socket;
}
