import React from 'react';

interface StatProps {
    value: number;
    label: string;
    onClick?: () => void;
}

export const Stat: React.FC<StatProps> = ({ value, label, onClick }) => {
    return (
        <button className="stat" onClick={onClick}>
            <p className="value">{value}</p>
            <p className="label">{label}</p>
        </button>
    );
};