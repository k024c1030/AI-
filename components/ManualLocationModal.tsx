
import React, { useState } from 'react';

interface ManualLocationModalProps {
    onClose: () => void;
    onSave: (zip: string) => void;
}

const ManualLocationModal: React.FC<ManualLocationModalProps> = ({ onClose, onSave }) => {
    const [zip, setZip] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 簡単なバリデーション (数字とハイフンのみ許可、全角は半角へ変換)
        const cleanedZip = zip.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)).replace(/-/g, '');
        
        // 郵便番号形式チェック (3桁-4桁 または 7桁)
        if (cleanedZip.match(/^\d{7}$/)) {
            // ハイフンを入れて保存形式を統一 (例: 160-0022)
            const formattedZip = `${cleanedZip.slice(0, 3)}-${cleanedZip.slice(3)}`;
            onSave(formattedZip);
        } else {
            alert("正しい郵便番号を入力してください (例: 160-0022)");
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
                <p className="text-slate-600 text-sm text-center mb-6">郵便番号を入力してください。<br/>(例: 160-0022)</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="160-0022"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-center text-lg tracking-wider"
                        required
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!zip.trim()}
                        className="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:bg-slate-300 transition-colors"
                    >
                        設定する
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManualLocationModal;
