import React, { useState, useEffect } from 'react';
import type { Monster } from '../types';
import Confetti from './Confetti';

interface AttackResultProps {
  monster: Monster;
  achievementScore: number;
  onRestart: () => void;
}

const AttackResult: React.FC<AttackResultProps> = ({ monster, achievementScore, onRestart }) => {
  const initialHP = Math.min(monster.score, monster.currentHP + achievementScore);
  const [currentHP, setCurrentHP] = useState(initialHP);
  const [attacked, setAttacked] = useState(false);
  const finalHP = monster.currentHP;
  const isDefeated = finalHP <= 0;

  useEffect(() => {
    // Trigger the attack animation
    const attackTimeout = setTimeout(() => {
        setAttacked(true);
    }, 500);

    // Trigger the score reduction animation
    const scoreTimeout = setTimeout(() => {
        setCurrentHP(finalHP);
    }, 1000);

    return () => {
        clearTimeout(attackTimeout);
        clearTimeout(scoreTimeout);
    };
  }, [finalHP]);
  
  const getResultMessage = () => {
    if (isDefeated) {
      return "おめでとう！モンスターを完全にやっつけた！";
    }
    if (achievementScore > 0) {
      return `モンスターは弱っている！あと少し！`;
    }
    return "モンスターはまだ元気だ。明日また挑戦しよう！";
  }
  
  const hpPercentage = (currentHP / monster.score) * 100;

  return (
    <div className="relative flex flex-col items-center justify-center text-center p-6 w-full max-w-md mx-auto animate-fade-in-up">
      {isDefeated && <Confetti />}
      <h1 className="text-3xl font-bold text-slate-800 mb-4">{isDefeated ? "やったね！" : "こうかは ばつぐんだ！"}</h1>
      
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 w-full">
        <h2 className="text-3xl font-bold text-orange-500 mb-4">{monster.name}</h2>
        <div className={`relative w-64 h-64 mx-auto bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden ${attacked ? 'animate-flash' : ''}`}>
            <img src={monster.imageUrl} alt={monster.name} className={`w-full h-full object-cover ${attacked ? 'animate-shake' : ''}`} />
             {attacked && achievementScore > 0 && (
                <p className="text-5xl font-bold text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 animate-ping" style={{animationDuration: '1s'}}>
                    -{achievementScore}
                </p>
            )}
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-6 border border-slate-300 overflow-hidden">
          <div
            className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${hpPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          HP: <span className="font-bold text-red-600 text-lg">{Math.round(currentHP)}</span> / {monster.score}
        </p>

        <p className="text-teal-600 font-bold mt-6 text-xl">{getResultMessage()}</p>
      </div>

      <p className="text-slate-500 mt-6 mb-6">
        日々の小さな達成が、あなたを強くします。お疲れ様でした！
      </p>
      <button
        onClick={onRestart}
        className="w-full px-8 py-4 bg-teal-500 text-white rounded-xl font-semibold text-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105"
      >
        ホームに戻る
      </button>
    </div>
  );
};

export default AttackResult;