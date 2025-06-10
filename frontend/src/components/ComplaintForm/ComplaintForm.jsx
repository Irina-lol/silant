import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ComplaintForm.module.css';

export const ComplaintForm = ({
  initialData, 
  onSave,       
  onCancel,    
  machines = [], 
}) => {
  const [formData, setFormData] = useState({
    failure_date: initialData?.failure_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    operating_hours: initialData?.operating_hours || '',
    failure_node: initialData?.failure_node?.id || '',
    failure_description: initialData?.failure_description || '',
    recovery_method: initialData?.recovery_method?.id || '',
    spare_parts: initialData?.spare_parts || '',
    machine: initialData?.machine?.id || machines[0]?.id || '',
  });

  const [handbooks, setHandbooks] = useState({
    failureNodes: [],  
    recoveryMethods: [], 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchHandbooks = async () => {
      try {
        const [nodesRes, methodsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/handbook/?name=Узел отказа'),
          axios.get('http://localhost:8000/api/handbook/?name=Способ восстановления'),
        ]);
        setHandbooks({
          failureNodes: nodesRes.data,
          recoveryMethods: methodsRes.data,
        });
      } catch (error) {
        console.error('Ошибка загрузки справочников:', error);
      }
    };
    fetchHandbooks();
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
    if (!formData.failure_date) newErrors.failure_date = 'Укажите дату отказа';
    if (!formData.operating_hours || isNaN(formData.operating_hours)) {
      newErrors.operating_hours = 'Некорректная наработка';
    }
    if (!formData.failure_node) newErrors.failure_node = 'Выберите узел отказа';
    if (!formData.failure_description) newErrors.failure_description = 'Заполните описание';
    if (!formData.machine) newErrors.machine = 'Выберите машину';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formattedData = {
        ...formData,
        operating_hours: Number(formData.operating_hours),
        failure_date: `${formData.failure_date}T00:00:00`,
      };
      onSave(formattedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3>Информация об отказе</h3>
        
        <div className={`${styles.formGroup} ${errors.failure_date ? styles.error : ''}`}>
          <label>Дата отказа*:</label>
          <input
            type="date"
            name="failure_date"
            value={formData.failure_date}
            onChange={handleChange}
          />
          {errors.failure_date && <span className={styles.errorText}>{errors.failure_date}</span>}
        </div>

        <div className={`${styles.formGroup} ${errors.operating_hours ? styles.error : ''}`}>
          <label>Наработка (м/час)*:</label>
          <input
            type="number"
            name="operating_hours"
            value={formData.operating_hours}
            onChange={handleChange}
            min="0"
          />
          {errors.operating_hours && (
            <span className={styles.errorText}>{errors.operating_hours}</span>
          )}
        </div>

        <div className={`${styles.formGroup} ${errors.failure_node ? styles.error : ''}`}>
          <label>Узел отказа*:</label>
          <select
            name="failure_node"
            value={formData.failure_node}
            onChange={handleChange}
          >
            <option value="">Выберите узел</option>
            {handbooks.failureNodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.title}
              </option>
            ))}
          </select>
          {errors.failure_node && (
            <span className={styles.errorText}>{errors.failure_node}</span>
          )}
        </div>

        <div className={`${styles.formGroup} ${errors.failure_description ? styles.error : ''}`}>
          <label>Описание отказа*:</label>
          <textarea
            name="failure_description"
            value={formData.failure_description}
            onChange={handleChange}
            rows={3}
          />
          {errors.failure_description && (
            <span className={styles.errorText}>{errors.failure_description}</span>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Восстановление</h3>
        
        <div className={styles.formGroup}>
          <label>Способ восстановления:</label>
          <select
            name="recovery_method"
            value={formData.recovery_method}
            onChange={handleChange}
          >
            <option value="">Выберите способ</option>
            {handbooks.recoveryMethods.map(method => (
              <option key={method.id} value={method.id}>
                {method.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Используемые запчасти:</label>
          <textarea
            name="spare_parts"
            value={formData.spare_parts}
            onChange={handleChange}
            rows={2}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3>Принадлежность</h3>
        <div className={`${styles.formGroup} ${errors.machine ? styles.error : ''}`}>
          <label>Машина*:</label>
          <select
            name="machine"
            value={formData.machine}
            onChange={handleChange}
          >
            <option value="">Выберите машину</option>
            {machines.map(machine => (
              <option key={machine.id} value={machine.id}>
                {machine.factory_number} ({machine.model?.title})
              </option>
            ))}
          </select>
          {errors.machine && (
            <span className={styles.errorText}>{errors.machine}</span>
          )}
        </div>
      </div>

      <div className={styles.buttons}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Отмена
        </button>
        <button type="submit" className={styles.saveButton}>
          Сохранить
        </button>
      </div>
    </form>
  );
};
