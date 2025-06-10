import React from 'react';
import styles from './MachineDetailsModal.module.css';

export const MachineDetailsModal = ({ machine, onClose }) => {
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
      title: 'Технические характеристики',
      fields: [
        { label: 'Заводской номер', value: machine.factory_number },
        { label: 'Модель техники', value: machine.model?.title },
        { label: 'Модель двигателя', value: machine.engine_model?.title },
        { label: 'Заводской номер двигателя', value: machine.engine_number },
        { label: 'Модель трансмиссии', value: machine.transmission_model?.title },
        { label: 'Заводской номер трансмиссии', value: machine.transmission_number },
        { label: 'Модель ведущего моста', value: machine.drive_axle_model?.title },
        { label: 'Заводской номер ведущего моста', value: machine.drive_axle_number },
        { label: 'Модель управляемого моста', value: machine.steering_axle_model?.title },
        { label: 'Заводской номер управляемого моста', value: machine.steering_axle_number }
      ]
    },
    {
      title: 'Информация о поставке',
      fields: [
        { label: 'Договор поставки', value: machine.supply_contract },
        { label: 'Дата отгрузки с завода', value: formatDate(machine.shipping_date) },
        { label: 'Грузополучатель', value: machine.consignee },
        { label: 'Адрес поставки', value: machine.delivery_address }
      ]
    },
    {
      title: 'Комплектация и сервис',
      fields: [
        { label: 'Комплектация (доп. опции)', value: machine.equipment },
        { label: 'Клиент', value: machine.client?.company_name || machine.client?.username },
        { label: 'Сервисная компания', value: machine.service_company?.company_name || machine.service_company?.username }
      ]
    }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            Погрузчик {machine.model?.title || ''} 
            <span className={styles.factoryNumber}>№{machine.factory_number}</span>
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
            &times;
          </button>
        </div>

        <div className={styles.modalContent}>
          {sections.map((section, index) => (
            <section key={index} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <div className={styles.detailsGrid}>
                {section.fields.map((field, idx) => (
                  <div key={idx} className={styles.detailItem}>
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
          <button className={styles.closeModalButton} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
