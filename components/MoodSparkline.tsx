import React from 'react';
import type { MoodRecord } from '../types';

interface MoodSparklineProps {
    moodHistory: MoodRecord[];
}

const MoodSparkline: React.FC<MoodSparklineProps> = ({ moodHistory }) => {
    const width = 320, height = 80;
    const padding = { top: 10, right: 5, bottom: 10, left: 5 };
    
    // 過去14日間のデータを準備
    const data: (MoodRecord | null)[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        const record = moodHistory.find(r => r.date === dateString);
        data.push(record || null);
    }
    
    // 座標計算用のヘルパー関数
    const getX = (index: number) => padding.left + (index / 13) * (width - padding.left - padding.right);
    const getY = (score: number) => padding.top + (height - padding.top - padding.bottom) * (1 - (score + 3) / 6);

    if (moodHistory.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-500 text-sm">まだ記録がありません。</div>;
    }
    
    // 連続したデータ部分のパス（実線）を生成
    const pathSegments: string[] = [];
    let currentPath = '';
    data.forEach((d, i) => {
        if (d) {
            const command = currentPath === '' ? 'M' : 'L';
            currentPath += `${command} ${getX(i)},${getY(d.score)} `;
        } else {
            if (currentPath !== '') {
                pathSegments.push(currentPath);
                currentPath = '';
            }
        }
    });
    if (currentPath !== '') pathSegments.push(currentPath);

    // データが欠損している部分のパス（点線）を生成
    const dottedSegments: string[] = [];
    let lastPoint: {x: number, y: number} | null = null;
    data.forEach((d, i) => {
        const currentPointExists = d !== null;
        const currentPointCoords = currentPointExists ? { x: getX(i), y: getY(d!.score) } : null;

        if (lastPoint && !currentPointExists) {
            // 次の有効な点を探す
            let nextPointCoords = null;
            for (let j = i + 1; j < data.length; j++) {
                if (data[j]) {
                    nextPointCoords = { x: getX(j), y: getY(data[j]!.score) };
                    break;
                }
            }
            if (nextPointCoords) {
                 dottedSegments.push(`M ${lastPoint.x},${lastPoint.y} L ${nextPointCoords.x},${nextPointCoords.y}`);
            }
        }
        
        if (currentPointCoords) {
            lastPoint = currentPointCoords;
        }
    });

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {/* スコア0の基準線 */}
            <line x1={padding.left} x2={width-padding.right} y1={getY(0)} y2={getY(0)} stroke="#e2e8f0" strokeWidth="1" />
            
            {/* 欠損データを繋ぐ点線 */}
            {dottedSegments.map((d, i) => (
                 <path key={`dotted-${i}`} d={d} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2 3" />
            ))}

            {/* 実際のデータプロット（実線） */}
            {pathSegments.map((d, i) => (
                <path key={`solid-${i}`} d={d} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            
            {/* 各データポイントの丸印 */}
            {data.map((d, i) => d && (
                <circle key={i} cx={getX(i)} cy={getY(d.score)} r="3" fill="#10b981">
                    <title>{`${d.date}: ${d.emoji} (${d.score})`}</title>
                </circle>
            ))}
        </svg>
    );
};

export default MoodSparkline;
