import { WebSocketProvider } from "./context/WebSocketContext";
import CameraStream from "./components/CameraStream";
import Header from "./components/Header";
import KeyboardControl from "./components/KeyboardControl";
import StatusIndicator from "./components/StatusIndicator";
import Tips from "./components/Tips";
import FeedbackOverlay from "./components/FeedbackOverlay";

const CONTROL_URL = "ws://192.168.100.133:8082/RoverControl";
const CAM_URL = "ws://192.168.100.134:8081";

const App: React.FC = () => {
  return (
    <WebSocketProvider controlUrl={CONTROL_URL} camUrl={CAM_URL}>
      <div className="relative min-h-screen bg-gray-900">
        <Header />
        <CameraStream />
        <KeyboardControl />
        <StatusIndicator />
        <Tips />
        <FeedbackOverlay />
      </div>
    </WebSocketProvider>
  );
};

export default App;
