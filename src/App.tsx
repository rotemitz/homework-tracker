import { useState } from 'react';
import { useFirestore } from './hooks/useFirestore';
import { Modal } from './components/Modal';
import { HomeworkCard } from './components/HomeworkCard';
import { HomeworkForm } from './components/HomeworkForm';
import { SubjectsManager } from './components/SubjectsManager';
import type { Homework, HomeworkFormData } from './types';
import './App.css';

function App() {
  const {
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
  } = useFirestore();

  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [editingHomework, setEditingHomework] = useState<Homework | null>(null);

  const handleOpenAddHomework = () => {
    setEditingHomework(null);
    setIsHomeworkModalOpen(true);
  };

  const handleEditHomework = (hw: Homework) => {
    setEditingHomework(hw);
    setIsHomeworkModalOpen(true);
  };

  const handleHomeworkSubmit = async (data: HomeworkFormData, id?: string) => {
    if (id) {
      await updateHomework(id, data);
    } else {
      await addHomework(data);
    }
    setIsHomeworkModalOpen(false);
    setEditingHomework(null);
  };

  const handleDeleteHomework = async (id: string) => {
    if (!confirm('למחוק את השיעור הזה?')) return;
    await deleteHomework(id);
  };

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" />
        <p>טוען...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">📚 שיעורי הבית שלי</h1>
          <nav className="nav-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => setIsSubjectsModalOpen(true)}
            >
              <span className="btn-icon">🎨</span>
              <span className="btn-text">נושאים</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsArchiveModalOpen(true)}
            >
              <span className="btn-icon">📦</span>
              <span className="btn-text">ארכיון</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Add Homework Button */}
        <section className="add-homework-section">
          <button
            className="btn btn-primary btn-large"
            onClick={handleOpenAddHomework}
          >
            <span className="btn-icon">➕</span>
            <span>הוסף שיעור בית חדש</span>
          </button>
        </section>

        {/* Homework List */}
        <section className="homework-section">
          <h2 className="section-title">שיעורים לביצוע</h2>

          {homework.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h3>אין שיעורי בית!</h3>
              <p>כל הכבוד, סיימת הכל!</p>
            </div>
          ) : (
            <div className="homework-list">
              {homework.map((hw) => (
                <HomeworkCard
                  key={hw.id}
                  homework={hw}
                  subject={getSubjectById(hw.subjectId)}
                  onComplete={markAsCompleted}
                  onEdit={handleEditHomework}
                  onDelete={handleDeleteHomework}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add/Edit Homework Modal */}
      <Modal
        isOpen={isHomeworkModalOpen}
        onClose={() => {
          setIsHomeworkModalOpen(false);
          setEditingHomework(null);
        }}
        title={editingHomework ? 'עריכת שיעור בית' : 'הוספת שיעור בית'}
      >
        <HomeworkForm
          subjects={subjects}
          homework={editingHomework}
          onSubmit={handleHomeworkSubmit}
          onCancel={() => {
            setIsHomeworkModalOpen(false);
            setEditingHomework(null);
          }}
        />
      </Modal>

      {/* Subjects Modal */}
      <Modal
        isOpen={isSubjectsModalOpen}
        onClose={() => setIsSubjectsModalOpen(false)}
        title="ניהול נושאים"
      >
        <SubjectsManager
          subjects={subjects}
          onAdd={addSubject}
          onDelete={deleteSubject}
        />
      </Modal>

      {/* Archive Modal */}
      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="📦 ארכיון"
        large
      >
        {archivedHomework.length === 0 ? (
          <div className="empty-state-inline">
            <div className="empty-icon">📭</div>
            <p>הארכיון ריק</p>
          </div>
        ) : (
          <div className="homework-list">
            {archivedHomework.map((hw) => (
              <HomeworkCard
                key={hw.id}
                homework={hw}
                subject={getSubjectById(hw.subjectId)}
                isArchived
                onComplete={() => { }}
                onEdit={() => { }}
                onDelete={handleDeleteHomework}
                onRestore={restoreFromArchive}
              />
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
