import { useContext, useEffect, useRef } from "react";
import { WebSocketContext } from "../context/WebSocketContext";

const KeyboardControl: React.FC = () => {
  const { sendCommand } = useContext(WebSocketContext);
  const keyState = useRef<{
    KeyW: boolean;
    KeyS: boolean;
    KeyA: boolean;
    KeyD: boolean;
  }>({
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
  });
  const lastCommand = useRef<string | null>(null);

  const determineDirection = (): string => {
    if (keyState.current.KeyW && keyState.current.KeyS) return "stop";
    if (keyState.current.KeyA && keyState.current.KeyD) return "stop";
    if (keyState.current.KeyW && keyState.current.KeyA) return "nw";
    if (keyState.current.KeyW && keyState.current.KeyD) return "ne";
    if (keyState.current.KeyS && keyState.current.KeyA) return "sw";
    if (keyState.current.KeyS && keyState.current.KeyD) return "se";
    if (keyState.current.KeyW) return "n";
    if (keyState.current.KeyS) return "s";
    if (keyState.current.KeyA) return "w";
    if (keyState.current.KeyD) return "e";
    return "stop";
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (["KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
        keyState.current[e.code as keyof typeof keyState.current] = true;
        const direction = determineDirection();
        if (direction !== lastCommand.current) {
          sendCommand({ speed: direction === "stop" ? 0 : 250, direction });
          lastCommand.current = direction;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      if (["KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
        keyState.current[e.code as keyof typeof keyState.current] = false;
        const direction = determineDirection();
        if (direction !== lastCommand.current) {
          sendCommand({ speed: direction === "stop" ? 0 : 250, direction });
          lastCommand.current = direction;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [sendCommand]);

  return null;
};

export default KeyboardControl;
