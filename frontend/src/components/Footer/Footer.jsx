import React from "react";
import styles from './Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.contacts}>
                <span>+7-8352-20-12-09</span>
                <a href="#" className={styles.telegram}>Telegram</a>
            </div>
            <div className={styles.copyright}>Мой Силант 2022</div>
        </footer>
    );
};
