interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg z-50">
    <p>{message}</p>
    <button
      onClick={onRetry}
      className="mt-2 bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-200"
    >
      Повторить
    </button>
  </div>
);

export default ErrorMessage;
