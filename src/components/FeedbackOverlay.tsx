import { useContext } from "react";
import { WebSocketContext } from "../context/WebSocketContext";

const FeedbackOverlay: React.FC = () => {
  const { feedbackDirection } = useContext(WebSocketContext);

  const getFlashColor = (direction: string | null) => {
    switch (direction) {
      case "n":
        return "bg-green-500";
      case "s":
        return "bg-red-500";
      case "e":
        return "bg-blue-500";
      case "w":
        return "bg-yellow-500";
      case "nw":
        return "bg-teal-500";
      case "ne":
        return "bg-blue-700";
      case "sw":
        return "bg-orange-500";
      case "se":
        return "bg-purple-500";
      case "stop":
        return "bg-gray-500";
      default:
        return "bg-transparent";
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${getFlashColor(
        feedbackDirection
      )} ${feedbackDirection ? "opacity-20" : "opacity-0"}`}
    ></div>
  );
};

export default FeedbackOverlay;
