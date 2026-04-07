"use client";

import React, { useState } from 'react';
import PhysicalFrame from '@/components/UI/PhysicalFrame';
import Calendar from '@/components/Calendar/Calendar';
import NotesSidebar from '@/components/Notes/NotesSidebar';
import styles from './page.module.css';
import { Sun, Moon, Globe } from 'lucide-react';

export default function Home() {
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const handleRangeChange = (start: Date | null, end: Date | null) => {
    setSelectedRange({ start, end });
  };

  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <h1>Studio<span>Calendar</span></h1>
        </div>
        
        <div className={styles.navActions}>
          <button onClick={toggleTheme} className={styles.themeToggle} title="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="https://github.com/Rohitkr2002/Frontend-Engineering-Challenge" target="_blank" rel="noopener noreferrer" className={styles.githubBtn}>
            <Globe size={20} />
            <span>View Source</span>
          </a>
        </div>
      </nav>

      <section className={styles.calendarSection}>
        <PhysicalFrame>
          <div className={styles.splitLayout}>
            <Calendar onRangeChange={handleRangeChange} />
            <NotesSidebar currentMonth={currentMonth} selectedRange={selectedRange} />
          </div>
        </PhysicalFrame>
      </section>

      {/* Footer Info */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Rohit Kumar Singh</p>
      </footer>
    </main>
  );
}
