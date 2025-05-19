import { createContext, useEffect, useRef, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import { logger } from "../utils/logger";
import { getMotorSettings } from "../utils/motorSettings";

interface Command {
  speed: number;
  direction: string;
}

interface WebSocketContextType {
  sendCommand: (command: Command) => void;
  wsControlStatus: string;
  wsCamStatus: string;
  wsCamBlob: Blob | null;
  triggerFeedback: (direction: string) => void;
  feedbackDirection: string | null; // Добавляем в контекст
}

export const WebSocketContext = createContext<WebSocketContextType>({
  sendCommand: () => {},
  wsControlStatus: "disconnected",
  wsCamStatus: "disconnected",
  wsCamBlob: null,
  triggerFeedback: () => {},
  feedbackDirection: null,
});

interface WebSocketProviderProps {
  controlUrl: string;
  camUrl: string;
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  controlUrl,
  camUrl,
  children,
}) => {
  const [wsControlStatus, setWsControlStatus] =
    useState<string>("disconnected");
  const [wsCamStatus, setWsCamStatus] = useState<string>("disconnected");
  const [wsCamBlob, setWsCamBlob] = useState<Blob | null>(null);
  const [feedbackDirection, setFeedbackDirection] = useState<string | null>(
    null
  );
  const wsControlRef = useRef<WebSocket | null>(null);
  const wsCamRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<{ control: number; cam: number }>({
    control: 0,
    cam: 0,
  });
  const errorNotified = useRef<{ control: boolean; cam: boolean }>({
    control: false,
    cam: false,
  });
  const lastFrameTime = useRef(0);
  const firstFrameReceived = useRef(false);

  const connectWebSocket = (url: string, isCam: boolean) => {
    logger.info(
      `Попытка подключения WebSocket ${isCam ? "камеры" : "управления"}: ${url}`
    );
    const ws = new WebSocket(url);
    if (isCam) ws.binaryType = "blob";

    ws.onopen = () => {
      logger.info(
        `WebSocket ${isCam ? "камеры" : "управления"} подключен: ${url}`
      );
      toast.success(`WebSocket ${isCam ? "камеры" : "управления"} подключен`, {
        toastId: isCam ? "cam-connect" : "control-connect",
      });
      isCam ? setWsCamStatus("connected") : setWsControlStatus("connected");
      reconnectAttempts.current[isCam ? "cam" : "control"] = 0;
      errorNotified.current[isCam ? "cam" : "control"] = false;
    };

    ws.onmessage = (event) => {
      if (isCam) {
        const now = performance.now();
        if (!firstFrameReceived.current || now - lastFrameTime.current >= 33) {
          try {
            const blob = new Blob([event.data], { type: "image/jpeg" });
            if (!firstFrameReceived.current) {
              logger.info(
                `Первый кадр видеопотока получен: Blob { type: "${blob.type}" }`
              );
              firstFrameReceived.current = true;
            }
            setWsCamBlob(blob);
            lastFrameTime.current = now;
          } catch (error) {
            logger.error(`Ошибка обработки видеопотока: ${error}`);
          }
        } else {
          logger.info("Пропуск кадра: слишком частое обновление");
        }
      } else {
        logger.info(
          `Получено сообщение от WebSocket управления: ${event.data}`
        );
      }
    };

    ws.onclose = () => {
      logger.warn(
        `WebSocket ${isCam ? "камеры" : "управления"} закрыт: ${url}`
      );
      if (!errorNotified.current[isCam ? "cam" : "control"]) {
        toast.error(`WebSocket ${isCam ? "камеры" : "управления"} закрыт`, {
          toastId: isCam ? "cam-disconnect" : "control-disconnect",
        });
        errorNotified.current[isCam ? "cam" : "control"] = true;
      }
      isCam
        ? setWsCamStatus("disconnected")
        : setWsControlStatus("disconnected");

      const attempts = reconnectAttempts.current[isCam ? "cam" : "control"];
      if (attempts < 10) {
        const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
        logger.info(
          `Переподключение через ${delay} мс, попытка ${attempts + 1}`
        );
        setTimeout(() => {
          reconnectAttempts.current[isCam ? "cam" : "control"]++;
          connectWebSocket(url, isCam);
        }, delay);
      } else {
        logger.error(
          `Превышено максимальное количество попыток переподключения для ${
            isCam ? "камеры" : "управления"
          }`
        );
        toast.error(
          `Не удалось подключиться к WebSocket ${
            isCam ? "камеры" : "управления"
          } после 10 попыток`,
          { toastId: isCam ? "cam-error" : "control-error" }
        );
      }
    };

    ws.onerror = (error) => {
      logger.error(
        `Ошибка WebSocket ${isCam ? "камеры" : "управления"}: ${error}`
      );
      if (!errorNotified.current[isCam ? "cam" : "control"]) {
        toast.error(`Ошибка WebSocket ${isCam ? "камеры" : "управления"}`, {
          toastId: isCam ? "cam-error" : "control-error",
        });
        errorNotified.current[isCam ? "cam" : "control"] = true;
      }
      isCam ? setWsCamStatus("error") : setWsControlStatus("error");
    };

    if (isCam) wsCamRef.current = ws;
    else wsControlRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket(controlUrl, false);
    connectWebSocket(camUrl, true);
    return () => {
      logger.info("Закрытие WebSocket соединений");
      wsControlRef.current?.close();
      wsCamRef.current?.close();
    };
  }, [controlUrl, camUrl]);

  const sendCommand = (command: Command) => {
    if (wsControlStatus === "connected" && wsControlRef.current) {
      const motors = getMotorSettings(command);
      const message = JSON.stringify({ type: "move", motors });
      logger.info(`Отправка команды: ${message}`);
      try {
        const timeout = setTimeout(() => {
          logger.error("Таймаут отправки команды: 2 секунды");
          toast.error("Не удалось отправить команду: таймаут", {
            toastId: "command-timeout",
          });
        }, 2000);
        wsControlRef.current.send(message);
        clearTimeout(timeout);
        triggerFeedback(command.direction);
      } catch (error) {
        logger.error(`Ошибка отправки команды: ${error}`);
        toast.error("Ошибка отправки команды", { toastId: "command-error" });
      }
    } else {
      logger.warn("WebSocket управления не подключен");
      toast.warn("WebSocket управления не подключен", {
        toastId: "control-not-connected",
      });
    }
  };

  const triggerFeedback = (direction: string) => {
    logger.info(
      `Запуск визуальной обратной связи для направления: ${direction}`
    );
    setFeedbackDirection(direction);
    setTimeout(() => {
      logger.info(
        `Сброс визуальной обратной связи для направления: ${direction}`
      );
      setFeedbackDirection(null);
    }, 200);
  };

  return (
    <WebSocketContext.Provider
      value={{
        sendCommand,
        wsControlStatus,
        wsCamStatus,
        wsCamBlob,
        triggerFeedback,
        feedbackDirection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
