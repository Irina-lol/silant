import React, { useState, useEffect } from 'react';
import { AddComplaintModal } from '../AddComplaintModal/AddComplaintModal';
import { ComplaintDetailsModal } from '../ComplaintDetailsModal/ComplaintDetailsModal';
import axios from 'axios';
import styles from './ComplaintsTable.module.css';
import { 
  fetchComplaints, 
  createComplaint, 
  updateComplaint, 
  deleteComplaint 
} from '../../api/complaintApi';

export const ComplaintsTable = ({ role, machines }) => {
    const [complaints, setComplaints] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints(localStorage.getItem('authToken'));
        setComplaints(data);
      } catch (error) {
        console.error('Ошибка загрузки рекламаций:', error);
      }
    };
    loadComplaints();
    }, []);

    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [filters, setFilters] = useState({
      failureNode: '',
      recoveryMethod: '',
      machine: '',
    });
    const [sortConfig, setSortConfig] = useState({
      key: 'failure_date',
      direction: 'desc',
    });

    const filteredComplaints = complaints.filter(complaint => {
      return (
        (!filters.failureNode || 
          (complaint.failure_node?.title?.toLowerCase().includes(filters.failureNode.toLowerCase()))) &&
        (!filters.recoveryMethod || 
          (complaint.recovery_method?.title?.toLowerCase().includes(filters.recoveryMethod.toLowerCase()))) &&
        (!filters.machine || 
          (complaint.machine?.factory_number?.toLowerCase().includes(filters.machine.toLowerCase())))
      );
    });

    const sortedComplaints = [...filteredComplaints].sort((a, b) => {
      if (sortConfig.key === 'failure_date' || sortConfig.key === 'recovery_date') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      const valueA = a[sortConfig.key]?.title || a[sortConfig.key];
      const valueB = b[sortConfig.key]?.title || b[sortConfig.key];
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };

    const handleAddComplaint = async (complaintData) => {
      try {
        const newComplaint = await createComplaint(
          complaintData, 
          localStorage.getItem('authToken')
        );
        setComplaints([...complaints, newComplaint]); 
        setShowAddModal(false); 
      } catch (error) {
      console.error('Ошибка создания рекламации:', error);
      }
    };

    const handleUpdateComplaint = async (updatedData) => {
      try {
        await axios.patch(
          `http://localhost:8000/api/complaint/${editingComplaint.id}/`,
          updatedData,
          { headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` } }
        );
        setComplaints(complaints.map(c => 
          c.id === editingComplaint.id ? { ...c, ...updatedData } : c
        ));
        setEditingComplaint(null);
      } catch (error) {
        console.error('Ошибка обновления:', error);
      }
    };

    const handleDelete = async (id) => {
      if (window.confirm('Удалить рекламацию?')) {
        try {
          await axios.delete(
            `http://localhost:8000/api/complaint/${id}/`,
            { headers: { 'Authorization': `Token ${localStorage.getItem('authToken')}` } }
          );
          setComplaints(complaints.filter(c => c.id !== id));
        } catch (error) {
          console.error('Ошибка удаления:', error);
        }
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Рекламации</h2>
          {(role === 'MN' || role === 'SO') && (
            <button 
              onClick={() => setShowAddModal(true)}
              className={styles.addButton}
            >
              + Добавить
            </button>
          )}
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Узел отказа:</label>
            <input
              type="text"
              value={filters.failureNode}
              onChange={(e) => setFilters({...filters, failureNode: e.target.value})}
              placeholder="Фильтр..."
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Способ восстановления:</label>
            <input
              type="text"
              value={filters.recoveryMethod}
              onChange={(e) => setFilters({...filters, recoveryMethod: e.target.value})}
              placeholder="Фильтр..."
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Машина (зав. №):</label>
            <input
              type="text"
              value={filters.machine}
              onChange={(e) => setFilters({...filters, machine: e.target.value})}
              placeholder="Фильтр..."
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => requestSort('failure_date')}>
                  Дата отказа {sortConfig.key === 'failure_date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Наработка</th>
                <th onClick={() => requestSort('failure_node')}>
                  Узел отказа {sortConfig.key === 'failure_node' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Описание</th>
                <th onClick={() => requestSort('recovery_method')}>
                  Способ восстановления {sortConfig.key === 'recovery_method' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Машина</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedComplaints.length > 0 ? (
                sortedComplaints.map(complaint => (
                  <tr 
                    key={complaint.id} 
                    onClick={() => setSelectedComplaint(complaint)}
                    className={styles.clickableRow}
                  >
                    <td>{new Date(complaint.failure_date).toLocaleDateString('ru-RU')}</td>
                    <td>{complaint.operating_hours} м/час</td>
                    <td>{complaint.failure_node?.title || '-'}</td>
                    <td className={styles.descriptionCell}>
                      {complaint.failure_description?.slice(0, 50)}...
                    </td>
                    <td>{complaint.recovery_method?.title || '-'}</td>
                    <td>{complaint.machine?.factory_number || '-'}</td>
                    <td>
                      {(role === 'MN' || role === 'SO') && (
                        <>
                          <button 
                            className={styles.editButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingComplaint(complaint);
                            }}
                          >
                            Ред.
                          </button>
                          {role === 'MN' && (
                            <button
                              className={styles.deleteButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(complaint.id);
                              }}
                            >
                              Удалить
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={styles.noData}>
                    Нет данных
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <AddComplaintModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddComplaint}
            machines={machines}
          />
        )}

        {selectedComplaint && (
          <ComplaintDetailsModal
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
          />
        )}

        {editingComplaint && (
          <ComplaintDetailsModal
            complaint={editingComplaint}
            onClose={() => setEditingComplaint(null)}
            onSave={handleUpdateComplaint}
            isEditing={true}
          />
        )}
      </div>
    );
  };
