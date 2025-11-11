import React from 'react';
import type { MoodRecord } from '../types';
import MoodSparkline from './MoodSparkline';

interface MoodPickerModalProps {
    onClose: () => void;
    onSave: (record: MoodRecord) => void;
    moodHistory: MoodRecord[];
}

const MOODS = [
    { emoji: '😭', score: -3 }, { emoji: '😥', score: -2 }, { emoji: '😟', score: -1 },
    { emoji: '😐', score: 0 },
    { emoji: '🙂', score: 1 }, { emoji: '😄', score: 2 }, { emoji: '😆', score: 3 },
];

const MoodPickerModal: React.FC<MoodPickerModalProps> = ({ onClose, onSave, moodHistory }) => {
    const handleSelectMood = (mood: { emoji: string, score: number }) => {
        const today = new Date().toISOString().split('T')[0];
        onSave({ date: today, ...mood });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-fade-in-up">
                 <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">今日の状態は？</h2>
                
                <div className="flex justify-around items-center mb-8">
                    {MOODS.map(mood => (
                        <button key={mood.score} onClick={() => handleSelectMood(mood)} className="text-3xl p-1 rounded-full hover:bg-slate-200 transition-colors transform hover:scale-125">
                            {mood.emoji}
                        </button>
                    ))}
                </div>

                <h3 className="text-md font-bold text-slate-700 mb-2 text-center">過去14日間の記録</h3>
                <div className="h-24 bg-slate-50 rounded-lg p-2">
                    <MoodSparkline moodHistory={moodHistory} />
                </div>
            </div>
        </div>
    );
};

export default MoodPickerModal;