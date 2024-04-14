import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Замените на адрес вашего API
    timeout: 5000, // Настройте тайм-аут запросов по умолчанию
    headers: {
        'Content-Type': 'application/json', // Установите заголовок Content-Type по умолчанию
    }
});

export {API};
