import React from "react";
import styles from './Header.module.css';
import logo from '../../assets/logo.jpg';

export const Header = () => {
    return (
        <header className={styles.header}>
            <img src={logo} alt="Силант" className={styles.logo} />
            <div className={styles.contacts}>
                <span>+7-8352-20-12-09</span>
                <a href="#" className={styles.telegram}>Telegram</a>
            </div>
            <button className={styles.authButton}>Авторизация</button>
        </header>
    );
};
