import React, { useState } from "react";
import styles from './SearchForm.module.css';

export const SearchForm = ({ onSearch }) => {
    const [factoryNumber, setFactoryNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(factoryNumber);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="factoryNumber">Заводский номер:</label>
                <input
                    type="text"
                    id="factoryNumber"
                    value={factoryNumber}
                    onChange={(e) => setFactoryNumber(e.target.value)}
                    placeholder="Введите номер"
                />
            </div>
            <button type="submit" className={styles.searchButton}>Поиск</button>
        </form>
    );
};
