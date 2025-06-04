import axios from 'axios';

export const fetchMachineByNumber = async (factoryNumber) => {
    try {
        const response = await axios.get(
            `http://localhost:8000/api/public/machines/${factoryNumber}/`
        );
        return response.data;
    } catch (error) {
        console.error('Ошибка при запросе:', error);
        return null;
    }
};
