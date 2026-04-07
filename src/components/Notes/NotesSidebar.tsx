"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Edit3, Plus, Trash2, StickyNote } from 'lucide-react';
import styles from './NotesSidebar.module.css';

interface Note {
  id: string;
  text: string;
  dateKey: string; // e.g. "2024-01" or "2024-01-01"
}

interface NotesSidebarProps {
  currentMonth: Date;
  selectedRange?: { start: Date | null; end: Date | null };
}

const NotesSidebar: React.FC<NotesSidebarProps> = ({ currentMonth, selectedRange }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const monthKey = format(currentMonth, 'yyyy-MM');

  useEffect(() => {
    const saved = localStorage.getItem('calendar_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      text: newNote,
      dateKey: monthKey
    };
    setNotes([...notes, note]);
    setNewNote("");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const currentMonthNotes = notes.filter(n => n.dateKey === monthKey);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StickyNote size={18} className={styles.icon} />
        <h3>Monthly Memos</h3>
        <span className={styles.monthName}>{format(currentMonth, 'MMM yyyy')}</span>
      </div>

      <div className={styles.inputWrapper}>
        <textarea
          placeholder="Jot down a quick memo for this month..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className={styles.textarea}
        />
        <button onClick={addNote} className={styles.addBtn}>
          <Plus size={16} /> Add Note
        </button>
      </div>

      <div className={styles.notesList}>
        {currentMonthNotes.length === 0 ? (
          <div className={styles.emptyState}>No memos for this month yet.</div>
        ) : (
          currentMonthNotes.map(note => (
            <div key={note.id} className={styles.noteCard}>
              <p>{note.text}</p>
              <button onClick={() => deleteNote(note.id)} className={styles.deleteBtn}>
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {selectedRange?.start && (
        <div className={styles.rangeInfo}>
          <div className={styles.infoTitle}>Selection Active</div>
          <p>
            {format(selectedRange.start, 'MMM d')} 
            {selectedRange.end ? ` - ${format(selectedRange.end, 'MMM d')}` : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotesSidebar;
