import React, { useState } from 'react';
import type { DiaryEntry } from '../types';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface DiaryHistoryModalProps {
  diaryHistory: DiaryEntry[];
  onClose: () => void;
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (date: string) => void;
  onAddPast: () => void;
}

const achievementsList: Record<string, string> = {
  walk: '散歩をした',
  music: '好きな音楽を聴いた',
  talk: '誰かと話した',
  stretch: '軽い運動やストレッチをした',
  hobby: '趣味の時間を5分とった',
};

const DiaryHistoryModal: React.FC<DiaryHistoryModalProps> = ({ diaryHistory, onClose, onEdit, onDelete, onAddPast }) => {
    const [openItemId, setOpenItemId] = useState<string | null>(null);
    const [deletingDate, setDeletingDate] = useState<string | null>(null);
    const [openKebabMenu, setOpenKebabMenu] = useState<string | null>(null);

    const toggleItem = (date: string) => {
        setOpenItemId(openItemId === date ? null : date);
    };

    const handleConfirmDelete = () => {
        if (!deletingDate) return;
        onDelete(deletingDate);
        setDeletingDate(null);
    };

    const toggleKebabMenu = (e: React.MouseEvent, date: string) => {
        e.stopPropagation();
        setOpenKebabMenu(prev => (prev === date ? null : date));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close diary history">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">日記の履歴</h2>
                    <button 
                        onClick={() => {
                            onAddPast();
                            onClose();
                        }}
                        className="px-3 py-2 text-sm bg-white border border-teal-400 text-teal-500 rounded-lg hover:bg-teal-50 transition-colors font-semibold"
                    >
                        過去の日記を追加
                    </button>
                </div>


                <div className="max-h-[70vh] overflow-y-auto space-y-2 pr-2">
                    {diaryHistory.length > 0 ? (
                        diaryHistory.map(entry => (
                            <div key={entry.date} className="border border-slate-200 rounded-lg">
                                <div className="w-full flex justify-between items-center p-3 text-left bg-slate-50 hover:bg-slate-100">
                                    <button
                                        onClick={() => toggleItem(entry.date)}
                                        className="flex-grow flex justify-between items-center"
                                        aria-expanded={openItemId === entry.date}
                                    >
                                        <span className="font-semibold text-slate-700">{entry.date.replace(/-/g, '/')}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-teal-600 font-bold">+{entry.score} pt</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-slate-500 transition-transform ${openItemId === entry.date ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>
                                    <div className="relative ml-2">
                                        <button
                                            onClick={(e) => toggleKebabMenu(e, entry.date)}
                                            className="p-2 rounded-full hover:bg-slate-200"
                                            aria-label="Actions menu"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        {openKebabMenu === entry.date && (
                                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-20 border border-slate-200 py-1">
                                                <button
                                                    onClick={() => { onEdit(entry); setOpenKebabMenu(null); onClose(); }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                                >
                                                    編集
                                                </button>
                                                <button
                                                    onClick={() => { setDeletingDate(entry.date); setOpenKebabMenu(null); }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {openItemId === entry.date && (
                                    <div className="p-4 border-t border-slate-200 bg-white text-sm">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-teal-600 mb-1">P (Plan): 明日のための小さな目標</h3>
                                            <p className="text-slate-600 whitespace-pre-wrap">{entry.plan || '未設定'}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-teal-600 mb-2">D (Do) / C (Check): できたこと</h3>
                                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                                                {Object.entries(entry.achievements.predefined).filter(([_, v]) => v).map(([key]) => (
                                                    <li key={key}>{achievementsList[key] || key}</li>
                                                ))}
                                                {entry.achievements.custom.map(item => (
                                                    <li key={item.id}>{item.text}</li>
                                                ))}
                                                {(Object.values(entry.achievements.predefined).every(v => !v) && entry.achievements.custom.length === 0) && (
                                                    <li className="text-slate-400">達成した項目はありません</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 py-8">日記の記録がまだありません。</p>
                    )}
                </div>
            </div>
            {deletingDate && (
                <DeleteConfirmationModal
                    itemName={`${deletingDate.replace(/-/g, '/')}の`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeletingDate(null)}
                />
            )}
        </div>
    );
};

export default DiaryHistoryModal;