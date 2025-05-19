import { useContext, useEffect, useState, useRef } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import { logger } from "../utils/logger";

const CameraStream: React.FC = () => {
  const { wsCamBlob, wsCamStatus } = useContext(WebSocketContext);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const firstFrameProcessed = useRef(false);

  useEffect(() => {
    // Логируем инициализацию только один раз
    if (!firstFrameProcessed.current) {
      logger.info("Инициализация CameraStream");
    }

    if (wsCamBlob) {
      try {
        const url = URL.createObjectURL(wsCamBlob);
        setStreamUrl((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          return url;
        });
        if (!firstFrameProcessed.current) {
          firstFrameProcessed.current = true;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }
      } catch (error) {
        logger.error(`Ошибка создания URL для Blob: ${error}`);
      }
    }

    // Устанавливаем таймаут только один раз
    if (!firstFrameProcessed.current) {
      timeoutRef.current = setTimeout(() => {
        if (!firstFrameProcessed.current) {
          logger.error("Первый кадр не получен после 5 секунд");
        }
      }, 5000);
    }

    return () => {
      // Логируем очистку только один раз
      if (!firstFrameProcessed.current) {
        logger.info("Очистка CameraStream");
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (streamUrl) {
        URL.revokeObjectURL(streamUrl);
      }
    };
  }, [wsCamBlob]); // Убрали streamUrl из зависимостей

  return (
    <div className="relative w-full h-screen">
      {wsCamStatus === "connected" && streamUrl ? (
        <img
          src={streamUrl}
          alt="Video stream"
          className="w-full h-full object-cover"
          onError={(e) => logger.error(`Ошибка загрузки изображения: ${e}`)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default CameraStream;
