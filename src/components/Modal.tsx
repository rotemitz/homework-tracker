import React from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    large?: boolean;
}

export function Modal({ isOpen, onClose, title, children, large }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-backdrop" onClick={onClose} />
            <div className={`modal-content ${large ? 'modal-large' : ''}`}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
}
