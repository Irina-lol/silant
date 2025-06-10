import React, { useState } from 'react';
import styles from './MachineTable.module.css';
import { MachineDetailsModal } from '../MachineDetailsModal/MachineDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { EditMachineModal } from '../EditMachineModal/EditMachineModal';

export const MachineTable = ({ machines, role }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [editingMachine, setEditingMachine] = useState(null);
  const [machineToEdit, setMachineToEdit] = useState(null);
  const { user } = useAuth();

  if (!machines) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  const [filters, setFilters] = useState({
    model: '',
    engineModel: '',
    transmissionModel: '',
    driveAxleModel: '',
    steeringAxleModel: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'shipping_date',
    direction: 'desc' 
  });

  const filteredMachines = machines.filter(machine => {
    return (
      (!filters.model || (machine.model?.title && machine.model.title.toLowerCase().includes(filters.model.toLowerCase()))) &&
      (!filters.engineModel || (machine.engine_model?.title && machine.engine_model.title.toLowerCase().includes(filters.engineModel.toLowerCase()))) &&
      (!filters.transmissionModel || (machine.transmission_model?.title && machine.transmission_model.title.toLowerCase().includes(filters.transmissionModel.toLowerCase()))) &&
      (!filters.driveAxleModel || (machine.drive_axle_model?.title && machine.drive_axle_model.title.toLowerCase().includes(filters.driveAxleModel.toLowerCase()))) &&
      (!filters.steeringAxleModel || (machine.steering_axle_model?.title && machine.steering_axle_model.title.toLowerCase().includes(filters.steeringAxleModel.toLowerCase())))
    );
  });

  const sortedMachines = [...filteredMachines].sort((a, b) => {
    if (sortConfig.key === 'shipping_date') {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (a[sortConfig.key]?.title < b[sortConfig.key]?.title) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key]?.title > b[sortConfig.key]?.title) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Модель техники:</label>
          <input
            type="text"
            value={filters.model}
            onChange={(e) => setFilters({...filters, model: e.target.value})}
            placeholder="Фильтр по модели"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Модель двигателя:</label>
          <input
            type="text"
            value={filters.engineModel}
            onChange={(e) => setFilters({...filters, engineModel: e.target.value})}
            placeholder="Фильтр по двигателю"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Модель трансмиссии:</label>
          <input
            type="text"
            value={filters.transmissionModel}
            onChange={(e) => setFilters({...filters, transmissionModel: e.target.value})}
            placeholder="Фильтр по трансмиссии"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Модель ведущего моста:</label>
          <input
            type="text"
            value={filters.driveAxleModel}
            onChange={(e) => setFilters({...filters, driveAxleModel: e.target.value})}
            placeholder="Фильтр по мосту"
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label>Модель управляемого моста:</label>
          <input
            type="text"
            value={filters.steeringAxleModel}
            onChange={(e) => setFilters({...filters, steeringAxleModel: e.target.value})}
            placeholder="Фильтр по мосту"
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort('factory_number')}>
                Зав. № {getSortIndicator('factory_number')}
              </th>
              <th onClick={() => requestSort('model')}>
                Модель техники {getSortIndicator('model')}
              </th>
              <th onClick={() => requestSort('engine_model')}>
                Двигатель {getSortIndicator('engine_model')}
              </th>
              <th onClick={() => requestSort('transmission_model')}>
                Трансмиссия {getSortIndicator('transmission_model')}
              </th>
              <th onClick={() => requestSort('shipping_date')}>
                Дата отгрузки {getSortIndicator('shipping_date')}
              </th>
              <th>Клиент</th>
              <th>Сервисная компания</th>
              {role === 'MN' && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {sortedMachines.length > 0 ? (
              sortedMachines.map(machine => (
                <tr 
                  key={machine.factory_number} 
                  onClick={() => setSelectedMachine(machine)}
                  className={styles.clickableRow}
                >
                  <td>{machine.factory_number}</td>
                  <td>{machine.model?.title || '-'}</td>
                  <td>{machine.engine_model?.title || '-'}</td>
                  <td>{machine.transmission_model?.title || '-'}</td>
                  <td>{machine.shipping_date ? new Date(machine.shipping_date).toLocaleDateString() : '-'}</td>
                  <td>{machine.client?.company_name || '-'}</td>
                  <td>{machine.service_company?.company_name || '-'}</td>
                  {role === 'MN' && (
                    <td>
                      <button 
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMachineToEdit(machine);
                        }}
                      >
                        Редактировать
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role === 'MN' ? 8 : 7} className={styles.noData}>
                  Нет данных, соответствующих фильтрам
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedMachine && (
        <MachineDetailsModal
          machine={selectedMachine}
          onClose={() => setSelectedMachine(null)}
        />
      )}

      {machineToEdit && (
        <EditMachineModal
          machine={machineToEdit}
          onClose={() => setMachineToEdit(null)}
          onSave={(updatedMachine) => {
            setMachineToEdit(null);
          }}
        />
      )}
    </div>
  );
};
