import type { Homework, Subject } from '../types';
import './HomeworkCard.css';

interface HomeworkCardProps {
    homework: Homework;
    subject: Subject | undefined;
    isArchived?: boolean;
    onComplete: (id: string) => void;
    onEdit: (homework: Homework) => void;
    onDelete: (id: string) => void;
    onRestore?: (id: string) => void;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('he-IL', options);
}

function getDueDateInfo(dateStr: string): { text: string; className: string } {
    const dueDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
        return { text: 'באיחור! ' + formatDate(dateStr), className: 'urgent' };
    } else if (dueDate.getTime() === today.getTime()) {
        return { text: 'היום!', className: 'urgent' };
    } else if (dueDate.getTime() === tomorrow.getTime()) {
        return { text: 'מחר', className: 'soon' };
    }
    return { text: formatDate(dateStr), className: '' };
}

export function HomeworkCard({
    homework,
    subject,
    isArchived = false,
    onComplete,
    onEdit,
    onDelete,
    onRestore
}: HomeworkCardProps) {
    const subjectName = subject?.name || 'נושא לא ידוע';
    const subjectColor = subject?.color || '#6366f1';
    const dueDateInfo = isArchived ? { text: formatDate(homework.dueDate), className: '' } : getDueDateInfo(homework.dueDate);

    return (
        <div
            className={`homework-card ${isArchived ? 'archived' : ''}`}
            style={{ borderRightColor: subjectColor }}
        >
            <div className="homework-card-header">
                <div className="homework-subject">
                    <span className="subject-dot" style={{ backgroundColor: subjectColor }} />
                    <span>{subjectName}</span>
                </div>
                <div className={`homework-due-date ${dueDateInfo.className}`}>
                    <span>📅</span>
                    <span>{dueDateInfo.text}</span>
                </div>
            </div>

            {homework.description && (
                <div className="homework-description">{homework.description}</div>
            )}

            <div className="homework-actions">
                {isArchived ? (
                    <>
                        <button
                            className="btn btn-secondary btn-small"
                            onClick={() => onRestore?.(homework.id)}
                        >
                            ↩️ שחזר
                        </button>
                        <button
                            className="btn btn-danger btn-small"
                            onClick={() => onDelete(homework.id)}
                        >
                            🗑️ מחק
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="btn btn-success"
                            onClick={() => onComplete(homework.id)}
                        >
                            ✓ סיימתי!
                        </button>
                        <button
                            className="btn btn-ghost btn-small"
                            onClick={() => onEdit(homework)}
                        >
                            ✏️
                        </button>
                        <button
                            className="btn btn-ghost btn-small"
                            onClick={() => onDelete(homework.id)}
                        >
                            🗑️
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
