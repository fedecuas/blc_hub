"use client";

import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    if (!mounted) return <div style={{ width: '100px', height: '36px' }} />;

    return (
        <button
            onClick={toggleTheme}
            className="glass"
            style={{
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                color: 'var(--text-primary)'
            }}
        >
            {theme === 'light' ? '🌘 Night Owl' : '☀️ Light Owl'}
        </button>
    );
};

export default ThemeToggle;
