import React, { useState } from 'react';
import type { Subject, SubjectFormData } from '../types';
import './SubjectsManager.css';

interface SubjectsManagerProps {
    subjects: Subject[];
    onAdd: (data: SubjectFormData) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

export function SubjectsManager({ subjects, onAdd, onDelete }: SubjectsManagerProps) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#6366f1');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            await onAdd({ name: name.trim(), color });
            setName('');
            setColor('#6366f1');
        } catch (error) {
            console.error('Error adding subject:', error);
            alert('שגיאה בהוספת נושא');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('למחוק את הנושא הזה?')) return;

        try {
            await onDelete(id);
        } catch (error: any) {
            alert(error.message || 'שגיאה במחיקה');
        }
    };

    return (
        <div className="subjects-manager">
            <div className="subjects-list">
                {subjects.length === 0 ? (
                    <p className="text-center text-secondary">אין נושאים עדיין. הוסף נושא חדש למטה.</p>
                ) : (
                    subjects.map((subject) => (
                        <div key={subject.id} className="subject-item">
                            <div
                                className="subject-color-preview"
                                style={{ backgroundColor: subject.color }}
                            />
                            <span className="subject-item-name">{subject.name}</span>
                            <div className="subject-item-actions">
                                <button
                                    className="btn btn-ghost btn-small"
                                    onClick={() => handleDelete(subject.id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form className="subject-form form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group flex-grow">
                        <input
                            type="text"
                            placeholder="שם הנושא החדש"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="color"
                            className="color-picker"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-icon-only"
                        disabled={isSubmitting}
                    >
                        ➕
                    </button>
                </div>
            </form>
        </div>
    );
}
