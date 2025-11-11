import React, { useState } from 'react';

interface ManualLocationModalProps {
    onClose: () => void;
    onSave: (query: string, name: string) => void;
}

const ManualLocationModal: React.FC<ManualLocationModalProps> = ({ onClose, onSave }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSave(query.trim(), query.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">場所を手動で設定</h2>
                <p className="text-slate-600 text-sm text-center mb-6">市区町村名や郵便番号を入力してください。</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="例: 東京都渋谷区"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        required
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!query.trim()}
                        className="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:bg-slate-300"
                    >
                        設定する
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManualLocationModal;
