import React, { useState } from 'react';
import styles from './MaintenanceTable.module.css';
import { MaintenanceDetailsModal } from '../MaintenanceDetailsModal/MaintenanceDetailsModal';

export const MaintenanceTable = ({ maintenances, role }) => {
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    machine: '',
    serviceCompany: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  const filteredMaintenances = maintenances.filter(maintenance => {
    return (
      (!filters.type || (maintenance.type?.title && maintenance.type.title.toLowerCase().includes(filters.type.toLowerCase()))) &&
      (!filters.machine || (maintenance.machine?.factory_number && maintenance.machine.factory_number.toLowerCase().includes(filters.machine.toLowerCase()))) &&
      (!filters.serviceCompany || (maintenance.service_company?.company_name && maintenance.service_company.company_name.toLowerCase().includes(filters.serviceCompany.toLowerCase())))
    );
  });

  const sortedMaintenances = [...filteredMaintenances].sort((a, b) => {
    if (sortConfig.key === 'date' || sortConfig.key === 'order_date') {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
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
          <label>Вид ТО:</label>
          <input
            type="text"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            placeholder="Фильтр по виду ТО"
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Зав. № машины:</label>
          <input
            type="text"
            value={filters.machine}
            onChange={(e) => setFilters({...filters, machine: e.target.value})}
            placeholder="Фильтр по номеру"
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Сервисная компания:</label>
          <input
            type="text"
            value={filters.serviceCompany}
            onChange={(e) => setFilters({...filters, serviceCompany: e.target.value})}
            placeholder="Фильтр по компании"
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => requestSort('type')}>
                Вид ТО {getSortIndicator('type')}
              </th>
              <th onClick={() => requestSort('date')}>
                Дата проведения {getSortIndicator('date')}
              </th>
              <th>Наработка (м/час)</th>
              <th onClick={() => requestSort('order_number')}>
                № заказ-наряда {getSortIndicator('order_number')}
              </th>
              <th onClick={() => requestSort('order_date')}>
                Дата заказ-наряда {getSortIndicator('order_date')}
              </th>
              <th>Машина (зав. №)</th>
              <th>Сервисная компания</th>
              {['MN', 'SO'].includes(role) && <th>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {sortedMaintenances.length > 0 ? (
              sortedMaintenances.map(maintenance => (
                <tr 
                  key={`${maintenance.id}-${maintenance.date}`} 
                  onClick={() => setSelectedMaintenance(maintenance)}
                  className={styles.clickableRow}
                >
                  <td>{maintenance.type?.title || '-'}</td>
                  <td>{maintenance.date ? new Date(maintenance.date).toLocaleDateString('ru-RU') : '-'}</td>
                  <td>{maintenance.operating_hours || '-'}</td>
                  <td>{maintenance.order_number || '-'}</td>
                  <td>{maintenance.order_date ? new Date(maintenance.order_date).toLocaleDateString('ru-RU') : '-'}</td>
                  <td>{maintenance.machine?.factory_number || '-'}</td>
                  <td>{maintenance.service_company?.company_name || maintenance.service_company?.username || '-'}</td>
                  {['MN', 'SO'].includes(role) && (
                    <td>
                      <button 
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Ред.
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={['MN', 'SO'].includes(role) ? 8 : 7} className={styles.noData}>
                  Нет данных по ТО
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedMaintenance && (
        <MaintenanceDetailsModal
          maintenance={selectedMaintenance}
          onClose={() => setSelectedMaintenance(null)}
        />
      )}
    </div>
  );
};
