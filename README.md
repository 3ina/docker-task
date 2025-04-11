<div dir="rtl" style="text-align: right; font-family: Arial, sans-serif;">
# راهنمای جامع داکرایز کردن پروژه Node.js و Vue.js

این راهنما به شما کمک می‌کند تا یک پروژه کامل شامل بک‌اند Node.js (Express) و فرانت‌اند Vue.js را با استفاده از Docker و Docker Compose راه‌اندازی کنید. 

## پیش‌نیازها

قبل از شروع، اطمینان حاصل کنید که موارد زیر را نصب کرده‌اید:

- Node.js (نسخه 14 یا بالاتر)
- npm یا yarn
- Docker
- Docker Compose
- یک ویرایشگر کد (مانند VS Code)

## فهرست مطالب

1. [نصب Docker و Docker Compose](#گام-0-نصب-docker-و-docker-compose)
2. [راه‌اندازی پروژه بک‌اند (Node.js/Express)](#گام-1-راه‌اندازی-پروژه-بک‌اند-nodejs)
3. [راه‌اندازی پروژه فرانت‌اند (Vue.js)](#گام-2-راه‌اندازی-پروژه-فرانت‌اند-vuejs)
4. [ایجاد Dockerfile برای بک‌اند](#گام-3-ایجاد-dockerfile-برای-بک‌اند)
5. [ایجاد Dockerfile برای فرانت‌اند](#گام-4-ایجاد-dockerfile-برای-فرانت‌اند)
6. [ایجاد فایل docker-compose.yml](#گام-5-ایجاد-فایل-docker-composeyml)
7. [اجرای پروژه با Docker Compose](#گام-6-اجرای-پروژه-با-docker-compose)
8. [تست نهایی پروژه](#گام-7-تست-نهایی-پروژه)
9. [عیب‌یابی و نکات تکمیلی](#گام-8-عیب‌یابی-و-نکات-تکمیلی)

## گام 0: نصب Docker و Docker Compose

اگر هنوز Docker را نصب نکرده‌اید، می‌توانید از لینک‌های زیر برای نصب استفاده کنید:

- برای Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- برای macOS: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- برای Linux: [Docker Engine](https://docs.docker.com/engine/install/) و [Docker Compose](https://docs.docker.com/compose/install/)

پس از نصب، با اجرای دستورات زیر از صحت نصب اطمینان حاصل کنید:

```bash
docker --version
docker-compose --version
```

## گام 1: راه‌اندازی پروژه بک‌اند (Node.js)


### ایجاد پروژه Express

1. فایل `package.json` را ایجاد کنید:

```bash
npm init -y
```

2. نصب پکیج‌های مورد نیاز:

```bash
npm install express cors
npm install --save-dev nodemon
```


3. به‌روزرسانی بخش `scripts` در فایل `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

4. تست اجرای بک‌اند:

```bash
npm run dev
```

اکنون باید بتوانید با مراجعه به آدرس `http://localhost:3000/api/hello` پاسخ JSON را مشاهده کنید.

## گام 2: راه‌اندازی پروژه فرانت‌اند (Vue.js)

حالا به پوشه اصلی پروژه برگردید و پروژه Vue.js را ایجاد کنید:

```bash
cd ..

cd frontend
```

### ایجاد پروژه Vue.js





1. تست اجرای فرانت‌اند:

```bash
npm install
npm run serve
```

اکنون باید بتوانید با مراجعه به آدرس `http://localhost:8080` صفحه فرانت‌اند را مشاهده کنید.

## گام 3: ایجاد Dockerfile برای بک‌اند

حالا به پوشه بک‌اند برگردید و یک فایل به نام `Dockerfile` ایجاد کنید:

```bash
cd ../backend
```

محتوای فایل `Dockerfile`:

```dockerfile
# استفاده از تصویر رسمی Node.js
FROM node:18-alpine

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی بقیه فایل‌های پروژه
COPY . .

# باز کردن پورت 3000
EXPOSE 3000

# دستور اجرای برنامه
CMD ["npm", "start"]
```

## گام 4: ایجاد Dockerfile برای فرانت‌اند

حالا به پوشه فرانت‌اند برگردید و یک فایل به نام `Dockerfile` ایجاد کنید:

```bash
cd ../frontend
```

محتوای فایل `Dockerfile`:

```dockerfile
# مرحله ساخت (build stage)
FROM node:14-alpine as build-stage

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی بقیه فایل‌های پروژه
COPY . .

# ساخت برنامه برای محیط تولید
RUN npm run build

# مرحله تولید (production stage)
FROM nginx:stable-alpine as production-stage

# کپی فایل‌های ساخته شده از مرحله قبل به پوشه مناسب nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# کپی فایل پیکربندی nginx (اختیاری)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# باز کردن پورت 80
EXPOSE 80

# دستور اجرای nginx
CMD ["nginx", "-g", "daemon off;"]
```

حالا یک فایل `nginx.conf` در همان پوشه فرانت‌اند ایجاد کنید:

```
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

   

}
```

## گام 5: ایجاد فایل docker-compose.yml

حالا به پوشه اصلی پروژه برگردید و یک فایل به نام `docker-compose.yml` ایجاد کنید:

```bash
cd ..
```

محتوای فایل `docker-compose.yml`:

```yaml
version: '3'

services:
  # سرویس بک‌اند
  backend:
    build: ./backend
    container_name: nodejs-backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - app-network

  # سرویس فرانت‌اند
  frontend:
    build: ./frontend
    container_name: vuejs-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

# تعریف شبکه
networks:
  app-network:
    driver: bridge
```

## گام 6: اجرای پروژه با Docker Compose

حالا می‌توانید پروژه را با استفاده از Docker Compose اجرا کنید:

```bash
docker-compose up --build
```

این دستور تصاویر Docker را می‌سازد و کانتینرها را اجرا می‌کند. پارامتر `--build` باعث می‌شود که تصاویر هر بار از نو ساخته شوند.

برای اجرای پروژه در پس‌زمینه، می‌توانید از پارامتر `-d` استفاده کنید:

```bash
docker-compose up --build -d
```

برای مشاهده لاگ‌ها:

```bash
docker-compose logs -f
```

برای توقف پروژه:

```bash
docker-compose down
```

## گام 7: تست نهایی پروژه

پس از اجرای موفقیت‌آمیز پروژه با Docker Compose، می‌توانید آن را تست کنید:

1. در مرورگر خود به آدرس `http://localhost` بروید (توجه کنید که پورت 80 پیش‌فرض است و نیازی به ذکر آن نیست).
2. صفحه فرانت‌اند Vue.js را مشاهده خواهید کرد.
3. روی دکمه «دریافت پیام از بک‌اند» کلیک کنید.
4. باید پیام دریافتی از سرور بک‌اند را مشاهده کنید.

## گام 8: عیب‌یابی و نکات تکمیلی

### مشکلات رایج و راه‌حل‌ها

1. **مشکل دسترسی به API بک‌اند**:

   - اطمینان حاصل کنید که در محیط تولید، آدرس API به درستی به `http://backend:3000` تنظیم شده باشد.
   - بررسی کنید که هر دو سرویس به شبکه `app-network` متصل باشند.
2. **خطای CORS**:

   - اطمینان حاصل کنید که پکیج `cors` در بک‌اند به درستی پیکربندی شده باشد.
3. **تغییرات اعمال نمی‌شوند**:

   - پس از هر تغییر در کد، نیاز است که تصاویر Docker را دوباره بسازید:
     ```bash
     docker-compose down
     docker-compose up --build
     ```

### بهینه‌سازی‌های پیشرفته

1. **استفاده از Docker Volumes برای توسعه**:

   برای توسعه مداوم بدون نیاز به بازسازی مکرر تصاویر، می‌توانید از volumes استفاده کنید:

   ```yaml
   services:
     backend:
       # ...
       volumes:
         - ./backend:/app
         - /app/node_modules

     frontend:
       # ...
       volumes:
         - ./frontend:/app
         - /app/node_modules
   ```
2. **استفاده از محیط‌های مختلف**:

   می‌توانید فایل‌های docker-compose مختلفی برای محیط‌های توسعه و تولید ایجاد کنید:

   - `docker-compose.yml` (پیش‌فرض)
   - `docker-compose.dev.yml` (برای توسعه)
   - `docker-compose.prod.yml` (برای تولید)

   و آن‌ها را با دستور زیر اجرا کنید:

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

### جدول متغیرهای محیطی

| سرویس         | متغیر      | مقدار در محیط توسعه | مقدار در محیط تولید | توضیحات                       |
| ------------------ | --------------- | ----------------------------------- | ----------------------------------- | ------------------------------------ |
| بک‌اند       | PORT            | 3000                                | 3000                                | پورت اجرای سرور Express |
| بک‌اند       | NODE_ENV        | development                         | production                          | محیط اجرای Node.js          |
| فرانت‌اند | VUE_APP_API_URL | http://localhost:3000               | http://backend:3000                 | آدرس API بک‌اند            |

## نتیجه‌گیری

در این راهنما، شما یاد گرفتید چگونه یک پروژه کامل شامل بک‌اند Node.js (Express) و فرانت‌اند Vue.js را با استفاده از Docker و Docker Compose راه‌اندازی کنید. این مهارت‌ها به شما کمک می‌کنند تا پروژه‌های خود را در محیط‌های مختلف با حداقل تنظیمات اجرا کنید و از مزایای معماری میکروسرویس بهره‌مند شوید.

با استفاده از Docker، شما می‌توانید اطمینان حاصل کنید که برنامه شما در هر محیطی به یک شکل اجرا می‌شود و نیازی به نگرانی درباره تفاوت‌های محیط‌های مختلف نخواهید داشت.

## منابع تکمیلی

- [مستندات رسمی Docker](https://docs.docker.com/)
- [مستندات رسمی Docker Compose](https://docs.docker.com/compose/)
- [مستندات Node.js](https://nodejs.org/en/docs/)
- [مستندات Vue.js](https://vuejs.org/guide/introduction.html)

</div>
