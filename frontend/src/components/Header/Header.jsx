import React, { useState } from "react";
import styles from './Header.module.css';
import logo from '../../assets/logo.jpg';
import { AuthModal } from '../AuthModal/AuthModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const Header = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { user, logout } = useAuth();

    return (
        <header className={styles.header}>
            <img src={logo} alt="Силант" className={styles.logo} />
            <div className={styles.contacts}>
                <span>+7-8352-20-12-09</span>
                <a href="#" className={styles.telegram}>Telegram</a>
            </div>
            {user ? (
                <div className={styles.userPanel}>
                    <span>{user.company_name || user.username}</span>
                    <button onClick={logout} className={styles.authButton}>Выйти</button>
                </div>
            ) : (
                <button
                    onClick={() => setShowAuthModal(true)}
                    className={styles.authButton}
                >
                    Авторизация
                </button>
            )}
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onLogin={(user, token) => {
                        setShowAuthModal(false);
                    }}
                />
            )}
        </header>
    );
};
