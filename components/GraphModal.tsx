import React, { useState, useMemo } from 'react';
import type { StressRecord, SleepRecord } from '../types';

interface GraphModalProps {
  onClose: () => void;
}

const STRESS_HISTORY_KEY = 'stressHistory';
const SLEEP_HISTORY_KEY = 'sleepHistory';

const getStressHistory = (): StressRecord[] => {
  try {
    const historyJson = localStorage.getItem(STRESS_HISTORY_KEY);
    if (!historyJson) return [];
    return (JSON.parse(historyJson) as StressRecord[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (e) { return []; }
};

const getSleepHistory = (): SleepRecord[] => {
  try {
    const historyJson = localStorage.getItem(SLEEP_HISTORY_KEY);
    if (!historyJson) return [];
    return (JSON.parse(historyJson) as SleepRecord[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch(e) { return []; }
}

const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

const GraphModal: React.FC<GraphModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'stress' | 'sleep'>('stress');
    const [sleepPeriod, setSleepPeriod] = useState<'week' | 'month'>('week');

    const stressHistory = useMemo(() => getStressHistory(), []);
    const sleepHistory = useMemo(() => getSleepHistory(), []);
    
    const getSleepDataForPeriod = (days: number): SleepRecord[] => {
        const data: SleepRecord[] = [];
        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const record = sleepHistory.find(r => r.date === dateString);
            data.push(record || { date: dateString, duration: 0, bedTime: '', wakeTime: '' });
        }
        return data;
    };

    const sleepData = useMemo(() => {
        return sleepPeriod === 'week' ? getSleepDataForPeriod(7) : getSleepDataForPeriod(30);
    }, [sleepHistory, sleepPeriod]);

    const renderStressGraph = () => {
         if (stressHistory.length < 2) {
            return <div className="h-full flex items-center justify-center text-slate-500">グラフを表示するにはデータが2件以上必要です。</div>;
        }
        const width = 320, height = 200, padding = { top: 20, right: 20, bottom: 40, left: 30 };
        const chartWidth = width - padding.left - padding.right, chartHeight = height - padding.top - padding.bottom;
        const minDate = new Date(stressHistory[0].date), maxDate = new Date(stressHistory[stressHistory.length - 1].date);
        const dateRange = maxDate.getTime() - minDate.getTime();
        const getX = (date: Date) => padding.left + (dateRange === 0 ? 0 : ((date.getTime() - minDate.getTime()) / dateRange) * chartWidth);
        const getY = (score: number) => padding.top + chartHeight - (score / 100) * chartHeight;
        const pathData = stressHistory.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(new Date(d.date))},${getY(d.score)}`).join(' ');
        
        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {[0, 25, 50, 75, 100].map(label => (
                    <g key={label}>
                        <line x1={padding.left} x2={width - padding.right} y1={getY(label)} y2={getY(label)} stroke="#e2e8f0" />
                        <text x={padding.left - 8} y={getY(label) + 4} textAnchor="end" fontSize="10" fill="#64748b">{label}</text>
                    </g>
                ))}
                <text x={getX(minDate)} y={height - 15} textAnchor="middle" fontSize="10" fill="#64748b">{formatDate(minDate)}</text>
                <text x={getX(maxDate)} y={height - 15} textAnchor="middle" fontSize="10" fill="#64748b">{formatDate(maxDate)}</text>
                <path d={pathData} fill="none" stroke="#f97316" strokeWidth="2" />
                {stressHistory.map(d => <circle key={d.date} cx={getX(new Date(d.date))} cy={getY(d.score)} r="3" fill="#f97316" />)}
            </svg>
        );
    };
    
    const renderSleepGraph = () => {
        if (sleepData.filter(d => d.duration > 0).length === 0) {
            return <div className="h-full flex items-center justify-center text-slate-500">表示する睡眠データがありません。</div>;
        }

        const width = 320, height = 200, padding = { top: 20, right: 10, bottom: 40, left: 30 };
        const chartWidth = width - padding.left - padding.right, chartHeight = height - padding.top - padding.bottom;
        const barWidth = chartWidth / sleepData.length * 0.7;
        const maxDuration = 12; // Display up to 12 hours
        
        const getY = (hours: number) => padding.top + chartHeight - (hours / maxDuration) * chartHeight;

        return (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {[0, 2, 4, 6, 8, 10, 12].map(h => (
                    <g key={h}>
                        <line x1={padding.left} x2={width - padding.right} y1={getY(h)} y2={getY(h)} stroke="#e2e8f0" />
                        <text x={padding.left - 8} y={getY(h) + 4} textAnchor="end" fontSize="10" fill="#64748b">{h}</text>
                    </g>
                ))}
                <rect x={padding.left} y={getY(8)} width={chartWidth} height={getY(6) - getY(8)} fill="#14b8a6" fillOpacity="0.1" />
                
                {sleepData.map((d, i) => {
                    const x = padding.left + (chartWidth / sleepData.length) * (i + 0.5) - barWidth / 2;
                    const y = getY(d.duration);
                    const date = new Date(d.date);
                    const showLabel = sleepPeriod === 'week' || i % 5 === 0 || i === sleepData.length - 1;

                    return (
                        <g key={d.date}>
                            <rect x={x} y={y} width={barWidth} height={chartHeight + padding.top - y} fill="#3b82f6" rx="2" />
                            {showLabel && (
                               <text x={x + barWidth / 2} y={height - 15} textAnchor="middle" fontSize="10" fill="#64748b">{formatDate(date)}</text>
                            )}
                        </g>
                    )
                })}
            </svg>
        );
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close graph">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">健康状態の推移</h2>
            
            <div className="flex justify-center mb-4">
                <div className="bg-slate-100 p-1 rounded-lg flex text-sm">
                    <button 
                        onClick={() => setActiveTab('stress')}
                        className={`px-4 py-1 rounded-md transition-all ${activeTab === 'stress' ? 'bg-white shadow-sm text-orange-600 font-semibold' : 'text-slate-600'}`}
                    >
                        ストレス
                    </button>
                    <button
                        onClick={() => setActiveTab('sleep')}
                        className={`px-4 py-1 rounded-md transition-all ${activeTab === 'sleep' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-600'}`}
                    >
                        睡眠
                    </button>
                </div>
            </div>

            {activeTab === 'sleep' && (
                <div className="flex justify-center mb-2">
                    <div className="bg-slate-100 p-1 rounded-lg flex text-xs">
                         <button 
                            onClick={() => setSleepPeriod('week')}
                            className={`px-3 py-1 rounded-md transition-all ${sleepPeriod === 'week' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-600'}`}
                        >
                            週
                        </button>
                        <button
                            onClick={() => setSleepPeriod('month')}
                            className={`px-3 py-1 rounded-md transition-all ${sleepPeriod === 'month' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-600'}`}
                        >
                            月
                        </button>
                    </div>
                </div>
            )}

            <div className="h-[200px]">
                {activeTab === 'stress' ? renderStressGraph() : renderSleepGraph()}
            </div>
        </div>
    </div>
  );
};

export default GraphModal;