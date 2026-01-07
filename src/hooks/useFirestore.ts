import { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    where
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Subject, Homework, HomeworkFormData, SubjectFormData } from '../types';

export function useFirestore() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [homework, setHomework] = useState<Homework[]>([]);
    const [archivedHomework, setArchivedHomework] = useState<Homework[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to subjects collection
        const subjectsQuery = query(collection(db, 'subjects'), orderBy('name'));
        const unsubscribeSubjects = onSnapshot(subjectsQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Subject));
            setSubjects(data);
            setLoading(false);
        }, (error) => {
            console.error('Error loading subjects:', error);
            setLoading(false);
        });

        // Listen to active homework
        const homeworkQuery = query(
            collection(db, 'homework'),
            where('completed', '==', false),
            orderBy('dueDate')
        );
        const unsubscribeHomework = onSnapshot(homeworkQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Homework));
            setHomework(data);
            setLoading(false);
        }, (error) => {
            console.error('Error loading homework:', error);
            setLoading(false);
        });

        // Listen to archived homework
        const archiveQuery = query(
            collection(db, 'homework'),
            where('completed', '==', true),
            orderBy('completedAt', 'desc')
        );
        const unsubscribeArchive = onSnapshot(archiveQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Homework));
            setArchivedHomework(data);
        });

        return () => {
            unsubscribeSubjects();
            unsubscribeHomework();
            unsubscribeArchive();
        };
    }, []);

    // Subject operations
    const addSubject = async (data: SubjectFormData) => {
        await addDoc(collection(db, 'subjects'), data);
    };

    const deleteSubject = async (id: string) => {
        const hasHomework = homework.some(hw => hw.subjectId === id) ||
            archivedHomework.some(hw => hw.subjectId === id);

        if (hasHomework) {
            throw new Error('לא ניתן למחוק נושא שיש בו שיעורים');
        }

        await deleteDoc(doc(db, 'subjects', id));
    };

    // Homework operations
    const addHomework = async (data: HomeworkFormData) => {
        await addDoc(collection(db, 'homework'), {
            ...data,
            completed: false,
            createdAt: new Date().toISOString()
        });
    };

    const updateHomework = async (id: string, data: HomeworkFormData) => {
        await updateDoc(doc(db, 'homework', id), {
            subjectId: data.subjectId,
            dueDate: data.dueDate,
            description: data.description
        });
    };

    const markAsCompleted = async (id: string) => {
        await updateDoc(doc(db, 'homework', id), {
            completed: true,
            completedAt: new Date().toISOString()
        });
    };

    const restoreFromArchive = async (id: string) => {
        await updateDoc(doc(db, 'homework', id), {
            completed: false,
            completedAt: null
        });
    };

    const deleteHomework = async (id: string) => {
        await deleteDoc(doc(db, 'homework', id));
    };

    return {
        subjects,
        homework,
        archivedHomework,
        loading,
        addSubject,
        deleteSubject,
        addHomework,
        updateHomework,
        markAsCompleted,
        restoreFromArchive,
        deleteHomework
    };
}
