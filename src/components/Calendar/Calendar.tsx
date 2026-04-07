"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isAfter, 
  isBefore,
  addDays,
  setMonth,
  setYear
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, RotateCcw } from 'lucide-react';
import styles from './Calendar.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
  onRangeChange?: (start: Date | null, end: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onRangeChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState(0);

  // Month navigation
  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (isBefore(date, startDate)) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  useEffect(() => {
    if (onRangeChange) {
      onRangeChange(startDate, endDate);
    }
  }, [startDate, endDate]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const resetRange = () => {
    setStartDate(null);
    setEndDate(null);
    setHoverDate(null);
  };

  const isInRange = (date: Date) => {
    if (startDate && endDate) {
      return (isAfter(date, startDate) || isSameDay(date, startDate)) && 
             (isBefore(date, endDate) || isSameDay(date, endDate));
    }
    if (startDate && hoverDate && !endDate) {
      const actualStart = isBefore(hoverDate, startDate) ? hoverDate : startDate;
      const actualEnd = isBefore(hoverDate, startDate) ? startDate : hoverDate;
      return (isAfter(date, actualStart) || isSameDay(date, actualStart)) && 
             (isBefore(date, actualEnd) || isSameDay(date, actualEnd));
    }
    return false;
  };

  const isSelectionBoundary = (date: Date) => {
    return (startDate && isSameDay(date, startDate)) || (endDate && isSameDay(date, endDate));
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Hero Section */}
      <div className={styles.heroWrapper}>
        <img src="hero-adventure.png" alt="Inspiration" className={styles.heroImage} />
        <div className={styles.monthOverlay}>
          <span>{format(currentMonth, 'yyyy')}</span>
          <h2>{format(currentMonth, 'MMMM')}</h2>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Header Controls */}
        <div className={styles.header}>
          <div className={styles.navigation}>
            <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={20} /></button>
            <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={20} /></button>
          </div>
          <div className={styles.actions}>
             {(startDate || endDate) && (
               <button onClick={resetRange} className={styles.resetBtn}>
                 <RotateCcw size={16} /> Reset
               </button>
             )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className={styles.gridContainer}>
          <div className={styles.weekDays}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className={styles.weekDay}>{d}</div>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentMonth.toString()}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={styles.daysGrid}
            >
              {days.map((date, idx) => {
                const sameMonth = isSameMonth(date, currentMonth);
                const selected = isSelectionBoundary(date);
                const inRange = isInRange(date);
                const today = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toString()}
                    className={`
                      ${styles.dayCell} 
                      ${!sameMonth ? styles.otherMonth : ''} 
                      ${selected ? styles.selectedDay : ''} 
                      ${inRange ? styles.inRange : ''}
                      ${today ? styles.today : ''}
                    `}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                  >
                    <span className={styles.dayNumber}>{format(date, 'd')}</span>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
