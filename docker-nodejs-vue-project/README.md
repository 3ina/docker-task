<style>
  body {
    direction: rtl;
    text-align: right;
    font-family: 'Vazir', sans-serif;
  }
</style>

# پروژه نمونه داکرایز شده Node.js و Vue.js

این پروژه نمونه برای آموزش داکرایز کردن یک اپلیکیشن کامل شامل بک‌اند Node.js (Express) و فرانت‌اند Vue.js ایجاد شده است.

## ساختار پروژه

```
docker-nodejs-vue-project/
├── backend/                # پروژه بک‌اند Node.js/Express
│   ├── Dockerfile         # فایل Docker برای بک‌اند
│   ├── index.js           # فایل اصلی سرور Express
│   └── package.json       # تنظیمات و وابستگی‌های بک‌اند
├── frontend/              # پروژه فرانت‌اند Vue.js
│   ├── Dockerfile         # فایل Docker برای فرانت‌اند
│   ├── nginx.conf         # تنظیمات Nginx برای سرو فایل‌های استاتیک
│   ├── .env.development   # متغیرهای محیطی برای محیط توسعه
│   ├── .env.production    # متغیرهای محیطی برای محیط تولید
│   └── src/               # کدهای منبع فرانت‌اند
└── docker-compose.yml     # فایل Docker Compose برای اجرای همزمان سرویس‌ها
```

## نحوه اجرا

1. اطمینان حاصل کنید که Docker و Docker Compose نصب شده باشند:

```bash
docker --version
docker-compose --version
```

2. پروژه را با Docker Compose اجرا کنید:

```bash
docker-compose up --build
```

3. در مرورگر خود به آدرس `http://localhost` بروید تا فرانت‌اند را مشاهده کنید.

## نکات مهم

- بک‌اند روی پورت 3000 اجرا می‌شود و API آن از طریق `http://localhost:3000/api/hello` قابل دسترسی است.
- فرانت‌اند روی پورت 80 اجرا می‌شود و از طریق `http://localhost` قابل دسترسی است.
- در محیط داکر، فرانت‌اند از طریق نام سرویس `backend` به بک‌اند متصل می‌شود.

## منابع مفید

- [مستندات رسمی Docker](https://docs.docker.com/)
- [مستندات رسمی Docker Compose](https://docs.docker.com/compose/)
- [مستندات Node.js](https://nodejs.org/en/docs/)
- [مستندات Vue.js](https://vuejs.org/guide/introduction.html)