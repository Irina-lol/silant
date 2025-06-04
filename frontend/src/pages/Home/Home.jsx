import React, { useState } from "react";
import { Header } from '../../components/Header/Header.jsx';
import { SearchForm } from '../../components/SearchForm/SearchForm.jsx';
import { MachineTable } from '../../components/MachineTable/MachineTable.jsx';
import { Footer } from '../../components/Footer/Footer.jsx';
import styles from './Home.module.css';
import axios from 'axios';

export const Home = () => {
    const [machine, setMachine] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (factoryNumber) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/public/machines/${factoryNumber}/`
            );
            setMachine(response.data);
            setError('');
        } catch (err) {
            setMachine(null);
            setError('Машина с таким номером не найдена');
            console.error('Ошибка при запросе:', err);
        }
    };

    return (
        <div className={styles.home}>
            <Header />
            <main className={styles.main}>
                <h1>Электронная сервисная книжка "Мой Силант"</h1>
                <p>Проверьте комплектацию и технические характеристики техники Силант</p>
                <SearchForm onSearch={handleSearch} />
                {error && <p className={styles.error}>{error}</p>}
                <MachineTable machine={machine} />
            </main>
            <Footer />
        </div>
    );
};
