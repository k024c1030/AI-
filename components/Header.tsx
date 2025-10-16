import React from 'react';

interface HeaderProps {
    powerBank: number;
    onOpenDiary: () => void;
    onOpenToDo: () => void;
    onOpenDiaryHistory: () => void;
    onOpenGraph: () => void;
    onOpenSleepDiary: () => void;
}

const Header: React.FC<HeaderProps> = ({ powerBank, onOpenDiary, onOpenToDo, onOpenDiaryHistory, onOpenGraph, onOpenSleepDiary }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-40 p-3">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 flex-wrap">
                    <button 
                        onClick={onOpenDiary}
                        className="px-3 py-2 text-sm bg-white border border-teal-400 text-teal-500 rounded-lg hover:bg-teal-50 transition-colors font-semibold"
                    >
                        日記作成
                    </button>
                    <button 
                        onClick={onOpenToDo}
                        className="px-3 py-2 text-sm bg-white border border-green-400 text-green-500 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                    >
                        ToDo
                    </button>
                     <button 
                        onClick={onOpenDiaryHistory}
                        className="px-3 py-2 text-sm bg-white border border-purple-400 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                    >
                        日記履歴
                    </button>
                    <button 
                        onClick={onOpenSleepDiary}
                        className="px-3 py-2 text-sm bg-white border border-blue-400 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                    >
                        睡眠記録
                    </button>
                    <button 
                        onClick={onOpenGraph}
                        className="px-3 py-2 text-sm bg-white border border-slate-400 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors font-semibold"
                    >
                        グラフ
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500">達成ポイント</p>
                    <p className="font-bold text-teal-500 text-lg">{powerBank}</p>
                </div>
            </div>
        </header>
    );
}

export default Header;