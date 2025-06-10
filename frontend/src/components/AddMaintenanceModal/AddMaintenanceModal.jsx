import React from 'react';
import { MaintenanceForm } from '../MaintenanceForm/MaintenanceForm';
import styles from './AddMaintenanceModal.module.css';

export const AddMaintenanceModal = ({ onClose, onSave, machines, serviceCompanies }) => {
  const initialData = {
    type: '',
    date: new Date().toISOString().split('T')[0],
    operating_hours: '',
    order_number: '',
    order_date: '',
    machine: machines[0]?.id || '',
    service_company: serviceCompanies[0]?.id || ''
  };

  const handleSave = (formData) => {
    const newMaintenance = {
      ...formData,
      operating_hours: Number(formData.operating_hours),
      date: `${formData.date}T00:00:00`,
      order_date: formData.order_date ? `${formData.order_date}T00:00:00` : null
    };
    onSave(newMaintenance);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Добавить новое ТО</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalContent}>
          <MaintenanceForm 
            initialData={initialData}
            onSave={handleSave}
            onCancel={onClose}
            machines={machines}
            serviceCompanies={serviceCompanies}
          />
        </div>
      </div>
    </div>
  );
};
