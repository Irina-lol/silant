# Система мониторинга погрузчиков "Силант" (бэкенд)

## Описание
Django-приложение для учета техники, ТО и рекламаций погрузчиков "Силант".

## Функционал
1. **Авторизация**
2. **Управление машинами**
3. **Техническое обслуживание (ТО)**
4. **Рекламации**
5. **REST API**

## Установка
1. Кланировать репозиторий:
    ```bash
   git clone https://github.com/Irina-lol/silant.git
2. Установить зависимости:
    ```bash
   pip install -r requirements.txt
3. Настроить БД (PostgreSQL) в backend/settings.py
4. Запустить миграции:
   ```bash
   python manage.py migrate
   
## API Endpoints
1. /api/machine/ - список машин (доступ по ролям)
2. /api/maintenance/ - ТО
3. /api/complaint/ - рекламации
4. /api/public/machines/<номер>/ - поиск машины для гостей
