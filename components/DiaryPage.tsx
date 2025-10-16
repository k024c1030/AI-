import React, { useState, useMemo, useEffect } from 'react';
import type { DiaryEntry } from '../types';

interface DiaryPageProps {
  onSave: (entry: DiaryEntry) => void;
  onClose: () => void;
  entryToEdit?: DiaryEntry | null;
  existingDates?: string[];
}

const achievementsList = [
  { id: 'walk', label: '散歩をした', points: 20 },
  { id: 'music', label: '好きな音楽を聴いた', points: 20 },
  { id: 'talk', label: '誰かと話した', points: 20 },
  { id: 'stretch', label: '軽い運動やストレッチをした', points: 20 },
  { id: 'hobby', label: '趣味の時間を5分とった', points: 20 },
];

const CUSTOM_ACHIEVEMENT_POINTS = 15;

const DiaryPage: React.FC<DiaryPageProps> = ({ onSave, onClose, entryToEdit, existingDates = [] }) => {
  const [date, setDate] = useState(entryToEdit?.date || new Date().toISOString().split('T')[0]);
  const [plan, setPlan] = useState(entryToEdit?.plan || '');
  const [checkedAchievements, setCheckedAchievements] = useState<Record<string, boolean>>(entryToEdit?.achievements.predefined || {});
  const [customAchievements, setCustomAchievements] = useState<{ id: number; text: string }[]>(entryToEdit?.achievements.custom || []);
  const [customText, setCustomText] = useState('');

  const isEditMode = !!entryToEdit;
  const isDateInvalid = !isEditMode && existingDates.includes(date);

  const handleCheckboxChange = (id: string) => {
    setCheckedAchievements(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleAddCustom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (customText.trim() !== '') {
      setCustomAchievements(prev => [...prev, { id: Date.now(), text: customText.trim() }]);
      setCustomText('');
    }
  };

  const handleRemoveCustom = (idToRemove: number) => {
    setCustomAchievements(prev => prev.filter(item => item.id !== idToRemove));
  };

  const achievementScore = useMemo(() => {
    const checkboxScore = achievementsList.reduce((total, item) => {
      return checkedAchievements[item.id] ? total + item.points : total;
    }, 0);
    const customScore = customAchievements.length * CUSTOM_ACHIEVEMENT_POINTS;
    return checkboxScore + customScore;
  }, [checkedAchievements, customAchievements]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDateInvalid) return;

    const entryData: DiaryEntry = {
        date,
        plan,
        achievements: {
            predefined: checkedAchievements,
            custom: customAchievements
        },
        score: achievementScore
    };
    onSave(entryData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in-up">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close diary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h2 id="diary-title" className="text-2xl font-bold text-slate-800 mb-4 text-center">
                {isEditMode ? `日記を編集 (${entryToEdit.date.replace(/-/g, '/')})` : 'PDCA日記でパワーを貯めよう'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                
                {!isEditMode && (
                     <div>
                        <label htmlFor="diary-date" className="block text-sm font-medium text-slate-700 mb-1">
                           日付
                        </label>
                        <input
                            id="diary-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            required
                        />
                         {isDateInvalid && (
                            <p className="text-red-500 text-xs mt-1">この日付の日記は既に存在します。</p>
                        )}
                    </div>
                )}


                {/* Plan */}
                <div>
                <label htmlFor="plan" className="block text-sm font-medium text-slate-700 mb-1">
                    <span className="font-bold text-teal-500">P (Plan)</span>: {isEditMode ? '設定した目標' : '明日のための小さな目標'}
                </label>
                <textarea
                    id="plan"
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="例：朝、5分だけストレッチする"
                    rows={2}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
                </div>
                
                {/* Do / Check */}
                <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    <span className="font-bold text-teal-500">D (Do) / C (Check)</span>: {isEditMode ? '達成したこと' : '今日できたこと'}
                </label>
                {/* Pre-defined achievements */}
                <div className="space-y-2">
                    {achievementsList.map(({ id, label }) => (
                    <label key={id} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                        <input
                        type="checkbox"
                        checked={!!checkedAchievements[id]}
                        onChange={() => handleCheckboxChange(id)}
                        className="h-5 w-5 rounded border-slate-300 text-teal-500 focus:ring-teal-400"
                        />
                        <span className="ml-3 text-slate-700">{label}</span>
                    </label>
                    ))}
                </div>

                {/* Custom achievements */}
                <div className="mt-4">
                    <label htmlFor="custom-achievement" className="block text-sm font-medium text-slate-700 mb-1">
                    その他のできたこと（1つにつき{CUSTOM_ACHIEVEMENT_POINTS}ポイント）
                    </label>
                    <div className="flex gap-2">
                    <input
                        id="custom-achievement"
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="例：勉強を30分頑張った"
                        className="flex-grow p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                    <button
                        onClick={handleAddCustom}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                        aria-label="Add custom achievement"
                    >
                        追加
                    </button>
                    </div>
                    <ul className="mt-2 space-y-1">
                    {customAchievements.map(item => (
                        <li key={item.id} className="flex items-center justify-between p-2 bg-teal-50 rounded-md text-sm">
                        <span className="text-teal-800">{item.text}</span>
                        <button
                            type="button"
                            onClick={() => handleRemoveCustom(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full"
                            aria-label={`Remove ${item.text}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>
                
                {/* Score */}
                <div className="text-center p-4 bg-teal-50 rounded-xl sticky bottom-0">
                    <p className="text-sm text-teal-800">獲得パワー（達成度）</p>
                    <p className="text-4xl font-bold text-teal-500">{achievementScore} <span className="text-xl font-medium">ポイント</span></p>
                    {!isEditMode && <p className="text-xs text-teal-600 mt-1">+10の日記作成ボーナスが追加されます！</p>}
                </div>
                
                <div className="text-center text-sm text-slate-500 p-2 bg-slate-100 rounded-lg">
                <p><span className="font-bold text-teal-500">A (Act)</span>: この調子で、明日も小さな一歩を踏み出しましょう！</p>
                </div>

                <button
                type="submit"
                disabled={isDateInvalid}
                className="w-full px-6 py-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 text-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                {isEditMode ? '変更を保存する' : '記録してパワーを貯める'}
                </button>
            </form>
        </div>
    </div>
  );
};

export default DiaryPage;