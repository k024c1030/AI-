import React from 'react';

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel, itemName }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center animate-fade-in-up">
        <h2 className="text-xl font-bold text-slate-800 mb-4">削除の確認</h2>
        <p className="text-slate-600 mb-6">
          本当に「{itemName}」日記を削除しますか？<br />この操作は元に戻せません。
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-colors w-1/2"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors w-1/2"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
