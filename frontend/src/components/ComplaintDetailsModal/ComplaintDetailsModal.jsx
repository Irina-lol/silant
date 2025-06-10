import React from 'react';
import styles from './ComplaintDetailsModal.module.css';

export const ComplaintDetailsModal = ({ complaint, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return dateString;
    }
  };

  const sections = [
    {
      title: 'Информация об отказе',
      fields: [
        { label: 'Дата отказа', value: formatDate(complaint.failure_date) },
        { label: 'Наработка (м/час)', value: complaint.operating_hours },
        { label: 'Узел отказа', value: complaint.failure_node?.title },
        { 
          label: 'Описание отказа', 
          value: complaint.failure_description,
          fullWidth: true 
        }
      ]
    },
    {
      title: 'Восстановление',
      fields: [
        { label: 'Способ восстановления', value: complaint.recovery_method?.title },
        { label: 'Используемые запчасти', value: complaint.spare_parts },
        { label: 'Дата восстановления', value: formatDate(complaint.recovery_date) },
        { label: 'Время простоя (дни)', value: complaint.downtime }
      ]
    },
    {
      title: 'Принадлежность',
      fields: [
        { label: 'Машина (зав. №)', value: complaint.machine?.factory_number },
        { label: 'Сервисная компания', value: complaint.service_company?.company_name }
      ]
    }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            Рекламация {complaint.machine?.factory_number && 
              `(Машина №${complaint.machine.factory_number})`}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.modalContent}>
          {sections.map((section, index) => (
            <section key={index} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <div className={styles.detailsGrid}>
                {section.fields.map((field, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.detailItem} ${
                      field.fullWidth ? styles.fullWidth : ''
                    }`}
                  >
                    <span className={styles.detailLabel}>{field.label}:</span>
                    <span className={styles.detailValue}>
                      {field.value || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.closeModalButton}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
