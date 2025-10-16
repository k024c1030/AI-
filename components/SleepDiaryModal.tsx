import React, { useState, useMemo } from 'react';
import type { SleepRecord } from '../types';

interface SleepDiaryModalProps {
  onSave: (record: SleepRecord) => void;
  onClose: () => void;
}

const SleepDiaryModal: React.FC<SleepDiaryModalProps> = ({ onSave, onClose }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [bedTime, setBedTime] = useState('23:00');
    const [wakeTime, setWakeTime] = useState('07:00');

    const duration = useMemo(() => {
        if (!bedTime || !wakeTime) return null;
        
        const bedDate = new Date(`1970-01-01T${bedTime}`);
        const wakeDate = new Date(`1970-01-01T${wakeTime}`);

        let diff = wakeDate.getTime() - bedDate.getTime();
        if (diff < 0) {
            diff += 24 * 60 * 60 * 1000; // Account for overnight sleep
        }

        const hours = diff / (1000 * 60 * 60);
        return hours;
    }, [bedTime, wakeTime]);
    
    const getFeedback = () => {
        if (duration === null) return { text: '', color: 'text-slate-500', isIdeal: false };
        if (duration >= 6 && duration <= 8) return { text: '理想的な睡眠時間です！', color: 'text-green-500', isIdeal: true };
        if (duration >= 4 && duration < 6) return { text: 'お疲れ様です。明日はもう少し休めると良いですね', color: 'text-yellow-500', isIdeal: false };
        if (duration < 4) return { text: 'とても短い睡眠でしたね。心と体を大切にしてくださいね', color: 'text-orange-500', isIdeal: false };
        if (duration > 8 && duration <= 10) return { text: 'たっぷり眠れましたね！良い休日だったのかもしれませんね', color: 'text-blue-500', isIdeal: false };
        if (duration > 10) return { text: 'たくさん休みましたね。疲れが溜まっていたのかもしれません。', color: 'text-indigo-500', isIdeal: false };
        return { text: '', color: 'text-slate-500', isIdeal: false };
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (duration !== null) {
            onSave({
                date,
                bedTime,
                wakeTime,
                duration
            });
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close sleep diary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">睡眠記録</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="sleep-date" className="block text-sm font-medium text-slate-700 mb-1">日付</label>
                        <input
                            id="sleep-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                             max={new Date().toISOString().split("T")[0]}
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-around items-center">
                        <div>
                            <label htmlFor="bedTime" className="block text-sm font-medium text-slate-700 text-center">布団に入った時間</label>
                            <input
                                id="bedTime"
                                type="time"
                                value={bedTime}
                                onChange={(e) => setBedTime(e.target.value)}
                                className="mt-1 w-32 p-2 border border-slate-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div className="text-slate-400 text-xl font-bold">→</div>
                        <div>
                            <label htmlFor="wakeTime" className="block text-sm font-medium text-slate-700 text-center">布団から出た時間</label>
                            <input
                                id="wakeTime"
                                type="time"
                                value={wakeTime}
                                onChange={(e) => setWakeTime(e.target.value)}
                                className="mt-1 w-32 p-2 border border-slate-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-blue-800">合計睡眠時間</p>
                        <p className="text-4xl font-bold text-blue-500">
                           {duration !== null ? `${duration.toFixed(1)}` : '-'}
                           <span className="text-xl font-medium"> 時間</span>
                        </p>
                        <p className={`text-sm font-semibold mt-1 ${getFeedback().color}`}>{getFeedback().text}</p>
                        {getFeedback().isIdeal && (
                            <p className="text-sm text-green-600 mt-1 font-bold animate-fade-in-up">+10 パワー獲得！</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={duration === null || !date}
                        className="w-full px-6 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 text-lg disabled:bg-slate-300"
                    >
                        記録する
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SleepDiaryModal;