import React from 'react';
import { usePedalInputs, PedalKeyInfo } from '../hooks/usePedalInputs';

const keyConfig: Record<string, PedalKeyInfo> = {
  a: { label: 'Left Pedal',  doubleTapDescription: 'Skip Turn' },
  l: { label: 'Right Pedal', doubleTapDescription: 'Bonus'     },
  // add more mappings freely!
};

export default function InputFeedbackScreen() {
  const { activeHalves, history } = usePedalInputs({
    keyConfig,
    highlightDuration: 200,
    historyLimit: 10,
  });

  return (
    <div className="flex flex-col justify-end h-screen w-screen bg-gray-900 text-white p-4">

      {/* History */}
      <div className="bg-gray-800 rounded-xl p-4 max-h-56 overflow-auto">
        <h2 className="text-lg font-semibold mb-2">Recent Inputs</h2>
        <ul className="text-sm space-y-1">
          {history.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>
                {keyConfig[item.key].label} ({item.half})
              </span>
              <span className="text-gray-400">{item.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Pedal rectangles */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {Object.entries(keyConfig).map(([key, info]) => (
          <div key={key} className="rounded-2xl overflow-hidden shadow-lg">
            {/* Top half (single‑press) */}
            <div
              className={`h-24 flex items-center justify-center text-xl font-bold transition-colors duration-200
                ${activeHalves[key] === 'top' ? 'bg-green-400 text-black' : 'bg-gray-700'}`}
            >
              {info.label}
            </div>
            {/* Bottom half (double‑tap / uppercase) */}
            <div
              className={`h-24 flex items-center justify-center text-md transition-colors duration-200
                ${activeHalves[key] === 'bottom' ? 'bg-blue-400 text-black' : 'bg-gray-600'}`}
            >
              {info.doubleTapDescription}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
