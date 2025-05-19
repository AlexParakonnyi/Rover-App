import React, { useEffect, useState } from "react";

const Spinner: React.FC = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-800/80 z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-lg">
        Подключение к роверу... {progress}%
      </p>
    </div>
  );
};

export default Spinner;
