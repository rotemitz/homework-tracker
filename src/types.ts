// Types for the homework tracker application

export interface Subject {
    id: string;
    name: string;
    color: string;
}

export interface Homework {
    id: string;
    subjectId: string;
    dueDate: string;
    description: string;
    completed: boolean;
    createdAt: string;
    completedAt?: string | null;
}

export interface HomeworkFormData {
    subjectId: string;
    dueDate: string;
    description: string;
}

export interface SubjectFormData {
    name: string;
    color: string;
}
