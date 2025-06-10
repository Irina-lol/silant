import React, { useState, useEffect } from 'react';
import styles from './MachineTabs.module.css';
import { MachineTable } from '../MachineTable/MachineTable.jsx';
import { MaintenanceTable } from '../MaintenanceTable/MaintenanceTable.jsx';
import { ComplaintsTable } from '../ComplaintsTable/ComplaintsTable.jsx';
import axios from 'axios';

export const MachineTabs = ({ role }) => {
  const [activeTab, setActiveTab] = useState('machines');
  const [machines, setMachines] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const machinesRes = await axios.get('http://localhost:8000/api/machine/');
        setMachines(machinesRes.data);
        
        const maintenancesRes = await axios.get('http://localhost:8000/api/maintenance/');
        setMaintenances(maintenancesRes.data);
        
        const complaintsRes = await axios.get('http://localhost:8000/api/complaint/');
        setComplaints(complaintsRes.data);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        <button
          className={`${styles.tab} ${activeTab === 'machines' ? styles.active : ''}`}
          onClick={() => setActiveTab('machines')}
        >
          Машины
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'maintenance' ? styles.active : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          Техническое обслуживание
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'complaints' ? styles.active : ''}`}
          onClick={() => setActiveTab('complaints')}
        >
          Рекламации
        </button>
      </div>
      
      <div className={styles.tabsContent}>
        {activeTab === 'machines' && (
          <MachineTable 
            machines={machines} 
            role={role} 
          />
        )}
        {activeTab === 'maintenance' && (
          <MaintenanceTable 
            maintenances={maintenances} 
            role={role} 
          />
        )}
        {activeTab === 'complaints' && (
          <ComplaintsTable 
            complaints={complaints} 
            role={role} 
          />
        )}
      </div>
    </div>
  );
};
