import { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import { Command } from "../types";

const Joystick: React.FC = () => {
  const { sendCommand } = useContext(WebSocketContext);
  const [isTouchSupported, setIsTouchSupported] = useState<boolean>(false);
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouchSupported(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ball = ballRef.current;
    const joystick = joystickRef.current;
    if (!ball || !joystick) return;

    const rect = ball.getBoundingClientRect();
    const isTouch = e.type === "touchstart";
    const clientX = isTouch
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;
    const clientY = isTouch
      ? (e as React.TouchEvent).touches[0].clientY
      : (e as React.MouseEvent).clientY;
    const shiftX = clientX - rect.left;
    const shiftY = clientY - rect.top;

    const moveAt = (moveEvent: MouseEvent | TouchEvent) => {
      const x =
        moveEvent instanceof MouseEvent
          ? moveEvent.pageX
          : moveEvent.touches[0].pageX;
      const y =
        moveEvent instanceof MouseEvent
          ? moveEvent.pageY
          : moveEvent.touches[0].pageY;
      const joystickRect = joystick.getBoundingClientRect();
      let newLeft = x - shiftX - joystickRect.left;
      let newTop = y - shiftY - joystickRect.top;

      newLeft = Math.max(0, Math.min(newLeft, joystickRect.width - rect.width));
      newTop = Math.max(0, Math.min(newTop, joystickRect.height - rect.height));

      ball.style.left = `${newLeft}px`;
      ball.style.top = `${newTop}px`;

      ball.hidden = true;
      const elemBelow = document.elementFromPoint(x, y);
      ball.hidden = false;

      const direction = elemBelow?.closest(".direction")?.id;
      if (
        direction &&
        direction !== activeDirection &&
        direction !== "center"
      ) {
        setActiveDirection(direction);
        sendCommand({ speed: 200, direction });
      } else if (!direction || direction === "center") {
        setActiveDirection(null);
      }
    };

    const stopDragging = () => {
      document.removeEventListener("mousemove", moveAt);
      document.removeEventListener("touchmove", moveAt);
      ball.style.left = "50%";
      ball.style.top = "50%";
      ball.style.transform = "translate(-50%, -50%)";
      setActiveDirection(null);
      sendCommand({ speed: 0, direction: "stop" });
    };

    document.addEventListener("mousemove", moveAt);
    document.addEventListener("touchmove", moveAt, { passive: false });
    ball.onmouseup = stopDragging;
    ball.addEventListener("touchend", stopDragging);
    ball.addEventListener("touchcancel", stopDragging);
  };

  if (!isTouchSupported) return null;

  const directions = [
    { id: "nw", className: "corner" },
    { id: "n", className: "middle-vertical" },
    { id: "ne", className: "corner" },
    { id: "w", className: "middle-horizontal" },
    { id: "center", className: "center" },
    { id: "e", className: "middle-horizontal" },
    { id: "sw", className: "corner" },
    { id: "s", className: "middle-vertical" },
    { id: "se", className: "corner" },
  ];

  return (
    <div
      ref={joystickRef}
      className="relative w-[300px] h-[300px] grid grid-cols-3 grid-rows-3 bg-black/5 border-2 border-gray-300 m-7 rounded-full overflow-hidden"
    >
      {directions.map((dir) => (
        <div
          key={dir.id}
          id={dir.id}
          className={`direction border border-gray-300 transition-all bg-blue-500/50 cursor-pointer ${
            dir.className
          } ${activeDirection === dir.id ? "bg-pink-400" : ""}`}
        >
          {dir.id === "center" && (
            <div
              ref={ballRef}
              className="absolute w-20 h-20 bg-brown-700 rounded-full border border-gray-300 transition-all z-10"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Joystick;
