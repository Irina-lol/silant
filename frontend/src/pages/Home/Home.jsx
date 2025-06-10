import React, { useState, useEffect } from "react";
import { Header } from '../../components/Header/Header.jsx';
import { SearchForm } from '../../components/SearchForm/SearchForm.jsx';
import { MachineTable } from '../../components/MachineTable/MachineTable.jsx';
import { Footer } from '../../components/Footer/Footer.jsx';
import styles from './Home.module.css';
import { useAuth } from "../../context/AuthContext.jsx";
import axios from 'axios';

export const Home = () => {
    const { user } = useAuth();
    const [machine, setMachine] = useState(null);
    const [machinesList, setMachinesList] = useState([]);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/machine/');
                setMachinesList(response.data);
            } catch (error) {
            console.error('Ошибка загрузки машин:', error);
            }
        };
        fetchMachines();
    }, []);

    const [error, setError] = useState('');

    const handleSearch = async (factoryNumber) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/public/machines/${factoryNumber}/`,
                {
                    headers: { 'Accept': 'application/json' },
                    withCredentials: true
                }
            );
            console.log('Ответ API:', response.data);
            setMachine(response.data);
            setError('');
        } catch (err) {
            console.error('Ошибка поиска:', err);
            setMachine(null);
            setError(
                err.response?.status === 404
                    ?'Машина с таким номером не найдена'
                    : 'Ошибка сервера. Попробуйте позже' 
            );
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
                <MachineTable machines={machine ? [machine] : []} role={user?.role} />
            </main>
            <Footer />
        </div>
    );
};
