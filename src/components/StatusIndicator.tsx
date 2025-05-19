import { useContext } from "react";
import { WebSocketContext } from "../context/WebSocketContext";

const StatusIndicator: React.FC = () => {
  const { wsCamStatus, wsControlStatus } = useContext(WebSocketContext);

  const getStatusText = (status: string, type: string) => {
    switch (status) {
      case "connected":
        return `${type}: подключено`;
      case "disconnected":
        return `${type}: отключено`;
      case "error":
        return `${type}: ошибка`;
      default:
        return `${type}: неизвестно`;
    }
  };

  return (
    <div className="absolute top-4 left-4 z-20 text-white text-lg sm:text-base font-semibold">
      <div
        className={`p-2 rounded ${
          wsCamStatus === "connected" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {getStatusText(wsCamStatus, "Камера")}
      </div>
      <div
        className={`p-2 rounded mt-2 ${
          wsControlStatus === "connected" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {getStatusText(wsControlStatus, "Управление")}
      </div>
    </div>
  );
};

export default StatusIndicator;
