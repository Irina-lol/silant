import React from 'react';
import styles from './MachineTable.module.css';

export const MachineTable = ({ machine }) => {
    if (!machine) return <p>Введите заводский номер для поиска.</p>;

    return (
        <div className={styles.tableWrapper}>
            <h3>Информация о комплектации и технических характеристиках</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Характеристика</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Зав. № машины</td>
                        <td>{machine.factory_number || '-'}</td>
                    </tr>
                    <tr>
                        <td>Модель техники</td>
                        <td>{machine.model?.title || '-'}</td>
                    </tr>
                    <tr>
                        <td>Модель двигателя</td>
                        <td>{machine.engine_model?.title  || '-'}</td>
                    </tr>
                    <tr>
                        <td>Зав. № двигателя</td>
                        <td>{machine.engine_number || '-'}</td>
                    </tr>
                    <tr>
                        <td>Модель трансмиссии</td>
                        <td>{machine.transmission_model?.title || '-'}</td>
                    </tr>
                    <tr>
                        <td>Зав. № трансмиссии</td>
                        <td>{machine.transmission_number || '-'}</td>
                    </tr>
                    <tr>
                        <td>Модель ведущего моста</td>
                        <td>{machine.drive_axle_model?.title || '-'}</td>
                    </tr>
                    <tr>
                        <td>Зав. № ведущего моста</td>
                        <td>{machine.drive_axle_number || '-'}</td>
                    </tr>
                    <tr>
                        <td>Модель управляемого моста</td>
                        <td>{machine.steering_axle_model?.title || '-'}</td>
                    </tr>
                    <tr>
                        <td>Зав. № управляемого моста</td>
                        <td>{machine.steering_axle_number || '-'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
