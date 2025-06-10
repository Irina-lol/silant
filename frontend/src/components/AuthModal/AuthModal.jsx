import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './AuthModal.module.css';

export const AuthModal = ({ onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getCsrfToken = () => {
        try {
            console.log('[DEBUG] Все куки:', document.cookie);
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];
            console.log('[DEBUG] Полученный CSRF токен:', cookieValue);
            return cookieValue;
        } catch (err) {
            console.error('[DEBUG] Ошибка при получении CSRF токена:', err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('[DEBUG] Начало процесса авторизации');

            console.log('[DEBUG] Запрос CSRF токена...');
            const csrfResponse = await axios.get(
                'http://localhost:8000/api/csrf_token/', 
                { withCredentials: true }
            );
            console.log('[DEBUG] Ответ на запрос CSRF:', csrfResponse.data);

            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                throw new Error('Не удалось получить CSRF токен из куки');
            }

            console.log('[DEBUG] Отправка данных для входа...');
            const authResponse = await axios.post(
                'http://localhost:8000/api/auth/login/',
                { username, password },
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('[DEBUG] Ответ авторизации:', authResponse.data);

        if (authResponse.data.user && authResponse.data.token) {
            onLogin(authResponse.data.user, authResponse.data.token);
            setTimeout(() => { 
                navigate('/dashboard')
                onClose();
            }, 100);
        } 

        } catch (err) {
            console.error('[DEBUG] Полная ошибка авторизации:', {
                message: err.message,
                response: err.response?.data,
                stack: err.stack
            });

            let errorMessage = 'Ошибка авторизации';
            if (err.response) {
                if (err.response.status === 400) {
                    errorMessage = 'Неверные учетные данные';
                } else if (err.response.status === 403) {
                    errorMessage = 'Доступ запрещен (CSRF ошибка)';
                } else if (err.response.data?.detail) {
                    errorMessage = err.response.data.detail;
                }
            } else if (err.message.includes('CSRF')) {
                errorMessage = 'Ошибка CSRF токена';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button 
                    className={styles.closeButton} 
                    onClick={onClose}
                    disabled={loading}
                >
                    ×
                </button>
                
                <h2>Авторизация</h2>
                
                {error && (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <small>Проверьте логи в консоли для подробностей</small>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Логин:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className={styles.debugInfo}>
                    <small>Отладочная информация:</small>
                    <small>Текущий хост: {window.location.host}</small>
                    <small>API endpoint: http://localhost:8000</small>
                </div>
            </div>
        </div>
    );
};
