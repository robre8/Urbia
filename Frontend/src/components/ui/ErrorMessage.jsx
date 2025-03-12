// ErrorMessage.jsx
import { useState, useEffect } from 'react';

export function ErrorMessage({ message, imageSrc }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-[9999]">
      {imageSrc && <img src={imageSrc} alt="Error" className="mb-4 h-24" />}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <p className="text-black text-sm">{message}</p>
      </div>
    </div>
  );
}
