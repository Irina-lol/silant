import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './EditMachineModal.module.css';

export const EditMachineModal = ({ machine, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    model: machine.model?.id || '',
    engine_model: machine.engine_model?.id || '',
    engine_number: machine.engine_number || '',
    transmission_model: machine.transmission_model?.id || '',
    transmission_number: machine.transmission_number || '',
    drive_axle_model: machine.drive_axle_model?.id || '',
    drive_axle_number: machine.drive_axle_number || '',
    steering_axle_model: machine.steering_axle_model?.id || '',
    steering_axle_number: machine.steering_axle_number || '',
    shipping_date: machine.shipping_date?.split('T')[0] || '',
  });

  const [handbooks, setHandbooks] = useState({
    models: [],
    engines: [],
    transmissions: [],
    axles: []
  });

  // Загрузка справочников
  useEffect(() => {
    const fetchHandbooks = async () => {
      try {
        const responses = await Promise.all([
          axios.get('http://localhost:8000/api/handbook/?name=Модель техники'),
          axios.get('http://localhost:8000/api/handbook/?name=Модель двигателя'),
          axios.get('http://localhost:8000/api/handbook/?name=Модель трансмиссии'),
          axios.get('http://localhost:8000/api/handbook/?name=Модель ведущего моста')
        ]);
        
        setHandbooks({
          models: responses[0].data,
          engines: responses[1].data,
          transmissions: responses[2].data,
          axles: responses[3].data
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8000/api/machine/${machine.id}/`,
        formData,
        { 
          headers: { 
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      onSave();
      onClose();
    } catch (error) {
      console.error('Ошибка обновления машины:', error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Редактировать погрузчик #{machine.factory_number}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h3>Технические характеристики</h3>
            
            <div className={styles.formGroup}>
              <label>Модель техники:</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              >
                <option value="">Выберите модель</option>
                {handbooks.models.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Модель двигателя:</label>
              <select
                name="engine_model"
                value={formData.engine_model}
                onChange={handleChange}
                required
              >
                <option value="">Выберите двигатель</option>
                {handbooks.engines.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Остальные поля аналогично */}
          </div>

          <div className={styles.formButtons}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Отмена
            </button>
            <button type="submit" className={styles.saveButton}>
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
