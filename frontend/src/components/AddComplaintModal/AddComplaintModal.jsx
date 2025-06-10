import React from 'react';
import { ComplaintForm } from '../ComplaintForm/ComplaintForm';
import styles from './AddComplaintModal.module.css';

export const AddComplaintModal = ({
  onClose,     
  onSave,     
  machines = [], 
}) => {
  const handleSubmit = (formData) => {
    const complaintData = {
      ...formData,
      operating_hours: Number(formData.operating_hours),
      failure_date: `${formData.failure_date}T00:00:00`, 
    };
    onSave(complaintData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Добавить рекламацию</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        <div className={styles.modalContent}>
          <ComplaintForm
            initialData={{
              failure_date: new Date().toISOString().split('T')[0], 
              machine: machines[0]?.id || '', 
            }}
            onSave={handleSubmit}
            onCancel={onClose}
            machines={machines}
          />
        </div>
      </div>
    </div>
  );
};
