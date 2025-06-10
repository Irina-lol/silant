import React, { useState, useEffect } from 'react';
import styles from './MaintenanceForm.module.css';
import axios from 'axios';

export const MaintenanceForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: initialData.type?.id || '',
    date: initialData.date?.split('T')[0] || '',
    operating_hours: initialData.operating_hours || '',
    order_number: initialData.order_number || '',
    order_date: initialData.order_date?.split('T')[0] || '',
    machine: initialData.machine?.id || '',
    service_company: initialData.service_company?.id || ''
  });

  const [handbooks, setHandbooks] = useState({
    maintenanceTypes: [],
    machines: [],
    serviceCompanies: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, machinesRes, companiesRes] = await Promise.all([
          axios.get('/api/handbook/?name=Вид ТО'),
          axios.get('/api/machine/'),
          axios.get('/api/users/?role=SO')
        ]);

        setHandbooks({
          maintenanceTypes: typesRes.data,
          machines: machinesRes.data,
          serviceCompanies: companiesRes.data
        });
      } catch (error) {
        console.error('Ошибка загрузки справочников:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.type) newErrors.type = 'Выберите вид ТО';
    if (!formData.date) newErrors.date = 'Укажите дату проведения';
    if (!formData.operating_hours || isNaN(formData.operating_hours)) 
      newErrors.operating_hours = 'Некорректная наработка';
    if (!formData.machine) newErrors.machine = 'Выберите машину';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        operating_hours: Number(formData.operating_hours)
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} id="maintenanceForm">
      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Основные данные</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="type">Вид ТО*:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? styles.errorInput : ''}
          >
            <option value="">Выберите вид ТО</option>
            {handbooks.maintenanceTypes.map(item => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          {errors.type && <span className={styles.errorText}>{errors.type}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Дата проведения*:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? styles.errorInput : ''}
          />
          {errors.date && <span className={styles.errorText}>{errors.date}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="operating_hours">Наработка (м/час)*:</label>
          <input
            type="number"
            id="operating_hours"
            name="operating_hours"
            value={formData.operating_hours}
            onChange={handleChange}
            min="0"
            step="1"
            className={errors.operating_hours ? styles.errorInput : ''}
          />
          {errors.operating_hours && (
            <span className={styles.errorText}>{errors.operating_hours}</span>
          )}
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Документы</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="order_number">№ заказ-наряда:</label>
          <input
            type="text"
            id="order_number"
            name="order_number"
            value={formData.order_number}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="order_date">Дата заказ-наряда:</label>
          <input
            type="date"
            id="order_date"
            name="order_date"
            value={formData.order_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.formSection}>
        <h3 className={styles.sectionTitle}>Принадлежность</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="machine">Машина*:</label>
          <select
            id="machine"
            name="machine"
            value={formData.machine}
            onChange={handleChange}
            className={errors.machine ? styles.errorInput : ''}
          >
            <option value="">Выберите машину</option>
            {handbooks.machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.factory_number} ({machine.model?.title})
              </option>
            ))}
          </select>
          {errors.machine && <span className={styles.errorText}>{errors.machine}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="service_company">Сервисная компания:</label>
          <select
            id="service_company"
            name="service_company"
            value={formData.service_company}
            onChange={handleChange}
          >
            <option value="">Выберите компанию</option>
            {handbooks.serviceCompanies.map(company => (
              <option key={company.id} value={company.id}>
                {company.company_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formButtons}>
        <button 
          type="button" 
          onClick={onCancel} 
          className={styles.cancelButton}
        >
          Отмена
        </button>
        <button 
          type="submit" 
          className={styles.saveButton}
        >
          Сохранить
        </button>
      </div>
    </form>
  );
};
