import React from 'react';

const Confetti: React.FC = () => {
    const confettiCount = 150;
    const colors = ['#fde68a', '#fca5a5', '#86efac', '#93c5fd', '#c4b5fd', '#f9a8d4'];

    const confetti = Array.from({ length: confettiCount }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animation: `confetti-fall ${Math.random() * 3 + 2}s ${Math.random() * 2}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 6 + 4}px`,
        };
        return <div key={i} className="absolute top-0" style={style}></div>;
    });

    return <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">{confetti}</div>;
};

export default Confetti;