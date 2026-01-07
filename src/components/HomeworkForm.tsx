import React, { useState, useEffect } from 'react';
import type { Subject, HomeworkFormData, Homework } from '../types';
import './HomeworkForm.css';

interface HomeworkFormProps {
    subjects: Subject[];
    homework?: Homework | null;
    onSubmit: (data: HomeworkFormData, id?: string) => Promise<void>;
    onCancel: () => void;
}

export function HomeworkForm({ subjects, homework, onSubmit, onCancel }: HomeworkFormProps) {
    const [subjectId, setSubjectId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (homework) {
            setSubjectId(homework.subjectId);
            setDueDate(homework.dueDate);
            setDescription(homework.description || '');
        } else {
            // Default to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDueDate(tomorrow.toISOString().split('T')[0]);
            setSubjectId('');
            setDescription('');
        }
    }, [homework]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({ subjectId, dueDate, description: description.trim() }, homework?.id);
        } catch (error) {
            console.error('Error submitting homework:', error);
            alert('שגיאה בשמירת השיעורים');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="subject-select">נושא</label>
                <select
                    id="subject-select"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    required
                >
                    <option value="">בחר נושא...</option>
                    {subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="due-date">תאריך הגשה</label>
                <input
                    type="date"
                    id="due-date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">תיאור</label>
                <textarea
                    id="description"
                    rows={3}
                    placeholder="עמודים, תרגילים, ספר..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'שומר...' : 'שמור'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>
                    ביטול
                </button>
            </div>
        </form>
    );
}
