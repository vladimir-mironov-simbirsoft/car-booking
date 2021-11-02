# Car-Booking Service

### Для запуска проекта:

1. Запустить БД
2. Прописать параметры БД в файле `.env` в корне проекта по примеру `.env.example`
3. Установить зависимости: `make install`
4. Создать структуру БД: `make migration`
5. Создать парк автомобилей: `make seed`
6. Запустить проект: `make run`

## Маршруты

После запуска доступны 2 маршрута:

### 1. Создать бронь

`POST` `http://localhost:3000/api/v1/booking`

*Body*
```json
{
  "carId": 1,
  "from": "2021-01-01",
  "to": "2021-01-02"
}
```

*Response*
```json
{
    "ok": true,
    "cost": 1000
}
```

---

### 2. Сгенерировать отчет

`GET` `http://localhost:3000/api/v1/booking/report?year=2021&month=1`

*Response:*
```json
{
    "ok": true,
    "cars": [
        {
            "carId": 1,
            "licensePlate": "A000AA",
            "activityPercentage": 93.33
        },
        {
            "carId": 2,
            "licensePlate": "A001AA",
            "activityPercentage": 46.67
        },
        {
            "carId": 3,
            "licensePlate": "A002AA",
            "activityPercentage": 80
        },
        {
            "carId": 4,
            "licensePlate": "A003AA",
            "activityPercentage": 13.33
        },
        {
            "carId": 5,
            "licensePlate": "A004AA",
            "activityPercentage": 0
        }
    ],
    "totalPercentage": 46.67
}
```