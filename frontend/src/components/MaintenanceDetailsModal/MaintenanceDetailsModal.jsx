import React, { useState } from 'react';
import { MaintenanceForm } from '../MaintenanceForm/MaintenanceForm';
import styles from './MaintenanceDetailsModal.module.css';

export const MaintenanceDetailsModal = ({ maintenance, onClose, onSave, role }) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleSave = (updatedData) => {
    onSave(updatedData);
    setIsEditing(false);
  };

  const sections = [
    {
      title: 'Основная информация',
      fields: [
        { label: 'Вид ТО', value: maintenance.type?.title },
        { label: 'Дата проведения', value: formatDate(maintenance.date) },
        { label: 'Наработка (м/час)', value: maintenance.operating_hours }
      ]
    },
    {
      title: 'Документы',
      fields: [
        { label: '№ заказ-наряда', value: maintenance.order_number || '-' },
        { label: 'Дата заказ-наряда', value: formatDate(maintenance.order_date) }
      ]
    },
    {
      title: 'Принадлежность',
      fields: [
        { label: 'Машина (зав. №)', value: maintenance.machine?.factory_number },
        { label: 'Сервисная компания', value: maintenance.service_company?.company_name }
      ]
    }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? 'Редактирование ТО' : `ТО: ${maintenance.type?.title || ''}`}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.modalContent}>
          {isEditing ? (
            <MaintenanceForm 
              initialData={maintenance}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {sections.map((section, index) => (
                <section key={index} className={styles.section}>
                  <h3>{section.title}</h3>
                  <div className={styles.detailsGrid}>
                    {section.fields.map((field, idx) => (
                      <div key={idx} className={styles.detailItem}>
                        <span>{field.label}:</span>
                        <span>{field.value || '-'}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          {!isEditing ? (
            <>
              {(role === 'MN' || role === 'SO') && (
                <button 
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать
                </button>
              )}
              <button 
                className={styles.closeButton}
                onClick={onClose}
              >
                Закрыть
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
