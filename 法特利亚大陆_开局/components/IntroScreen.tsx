import React, { useState, useEffect } from 'react';
import { Feather } from 'lucide-react';
import { Divider } from './Ornaments';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const textLines = [
    "你的童年故事里，是否也曾有过这样一个世界？",
    "古老的咒语在法师的指尖吟唱，",
    "锋利的刀剑在英雄的手中嗡鸣。",
    "国王在此加冕，骑士在此冲锋。",
    "破碎的王国等待着统一，邪恶的巨龙盘踞在孤山。",
    "预言与传说交织，荣耀与背叛并存。",
    " ", // Spacer
    "那些英雄史诗并非遥不可及。",
    "它们就沉睡在每一次挥剑的决心，",
    "每一次施法的专注，",
    "和每一个面对黑暗时，仍不愿回头的选择里。",
    " ", // Spacer
    "现在，故事的空白书页在你面前展开。",
    "拿起你的笔，写下第一行字。",
    "你的传说，将从何处开始？"
  ];

  useEffect(() => {
    if (visibleLines < textLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, 800); // Pace of revealing lines
      return () => clearTimeout(timeout);
    }
  }, [visibleLines, textLines.length]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080')] bg-cover bg-center opacity-10 filter blur-sm grayscale brightness-50 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-transparent to-stone-950 z-0"></div>

      <div className="max-w-3xl w-full z-10 text-center space-y-6">
        <div className="mb-12 opacity-80">
            <h1 className="text-4xl md:text-6xl text-amber-500 font-cinzel tracking-widest drop-shadow-lg mb-4">
                CHRONICLES
            </h1>
            <div className="h-1 w-24 mx-auto bg-amber-700"></div>
        </div>

        <div className="space-y-4 min-h-[400px]">
          {textLines.map((line, index) => (
            <p
              key={index}
              className={`text-lg md:text-xl text-stone-300 leading-relaxed transition-all duration-1000 ease-out transform
                ${index < visibleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                ${line.trim() === '' ? 'h-4' : ''}
              `}
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <div className={`mt-12 transition-opacity duration-1000 ${visibleLines >= textLines.length ? 'opacity-100' : 'opacity-0'}`}>
          <Divider className="my-8" />
          <button
            onClick={onComplete}
            className="group relative px-8 py-3 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-600/50 text-amber-100 rounded-sm transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3 text-lg tracking-widest">
              <Feather className="w-5 h-5" />
              开启诗篇
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/20 to-amber-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
