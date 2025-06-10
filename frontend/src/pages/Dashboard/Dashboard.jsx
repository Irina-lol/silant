import React from 'react';
import { Header } from '../../components/Header/Header.jsx';
import { Footer } from '../../components/Footer/Footer.jsx';
import { MachineTabs } from '../../components/MachineTabs/MachineTabs.jsx';
import styles from './Dashboard.module.css';
import { useAuth } from '../../context/AuthContext.jsx';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className={styles.dashboard}>
      <Header />
      <main className={styles.main}>
        <h1>Сервисная система "Мой Силант"</h1>
        <p>Добро пожаловать, {user?.company_name || user?.username}</p>
        
        <MachineTabs role={user?.role} />
      </main>
      <Footer />
    </div>
  );
};
