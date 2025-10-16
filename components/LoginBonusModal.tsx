import React from 'react';

interface LoginBonusModalProps {
    onClose: () => void;
    days: number;
    points: number;
}

const LoginBonusModal: React.FC<LoginBonusModalProps> = ({ onClose, days, points }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-fade-in-up">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">ログインボーナス！</h2>
                <p className="text-slate-600 mb-4">今日も一日頑張りましょう！</p>
                
                <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4 mb-6">
                    <p className="text-lg text-teal-800 font-semibold">
                        {days}日連続ログイン達成！
                    </p>
                    <p className="text-4xl font-bold text-teal-500 my-2">
                        {points} <span className="text-xl">ポイント</span>
                    </p>
                    <p className="text-xs text-teal-600">パワーを獲得しました</p>
                </div>

                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default LoginBonusModal;