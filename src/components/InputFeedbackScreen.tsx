// components/InputFeedbackScreen.tsx
import React, { useState, useEffect } from 'react';

type InputEvent = {
  key: string;
  timestamp: string;
  type: 'top' | 'bottom';
};

const keyLabels: Record<string, { label: string; doubleTapDescription: string }> = {
  a: { label: 'Left Pedal', doubleTapDescription: 'Skip Turn' },
  l: { label: 'Right Pedal', doubleTapDescription: 'Bonus' },
};

export default function InputFeedbackScreen() {
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: 'top' | 'bottom' }>({});
  const [history, setHistory] = useState<InputEvent[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!keyLabels[key]) return;

      const type = e.key === key ? 'top' : 'bottom'; // lowercase = top, uppercase = bottom
      setActiveKeys((prev) => ({ ...prev, [key]: type }));

      const event: InputEvent = {
        key,
        timestamp: new Date().toLocaleTimeString(),
        type,
      };
      setHistory((prev) => [event, ...prev.slice(0, 9)]);

      setTimeout(() => {
        setActiveKeys((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      }, 200); // brief highlight
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col justify-end w-screen h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 rounded-xl p-4 max-h-56 overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Recent Inputs</h2>
        <ul className="text-sm space-y-1">
          {history.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span className="capitalize">{keyLabels[item.key].label} ({item.type})</span>
              <span className="text-gray-400">{item.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {Object.entries(keyLabels).map(([key, { label, doubleTapDescription }]) => {
          const isTopActive = activeKeys[key] === 'top';
          const isBottomActive = activeKeys[key] === 'bottom';

          return (
            <div key={key} className="rounded-2xl overflow-hidden shadow-lg">
              <div
                className={`h-24 flex items-center justify-center text-xl font-bold transition-colors duration-200 ${
                  isTopActive ? 'bg-green-400 text-black' : 'bg-gray-700'
                }`}
              >
                {label}
              </div>
              <div
                className={`h-24 flex items-center justify-center text-md transition-colors duration-200 ${
                  isBottomActive ? 'bg-blue-400 text-black' : 'bg-gray-600'
                }`}
              >
                {doubleTapDescription}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
