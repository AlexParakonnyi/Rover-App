import { ToastContainer } from "react-toastify";

const Tips: React.FC = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    // closeButton={<span className="text-white font-bold">✕</span>}
  />
);

export default Tips;
