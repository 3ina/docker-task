# Comprehensive Guide to Dockerizing Node.js and Vue.js Projects

This guide will help you set up a complete project including a Node.js (Express) backend and Vue.js frontend using Docker and Docker Compose. This guide is designed for students with intermediate programming knowledge and basic familiarity with Docker.

## Prerequisites

Before starting, make sure you have installed the following:

- Node.js (version 14 or higher)
- npm or yarn
- Docker
- Docker Compose
- A code editor (such as VS Code)

## Table of Contents

1. [Installing Docker and Docker Compose](#step-0-installing-docker-and-docker-compose)
2. [Setting up the Backend Project (Node.js/Express)](#step-1-setting-up-the-backend-project-nodejs)
3. [Setting up the Frontend Project (Vue.js)](#step-2-setting-up-the-frontend-project-vuejs)
4. [Creating a Dockerfile for the Backend](#step-3-creating-a-dockerfile-for-the-backend)
5. [Creating a Dockerfile for the Frontend](#step-4-creating-a-dockerfile-for-the-frontend)
6. [Creating the docker-compose.yml File](#step-5-creating-the-docker-composeyml-file)
7. [Running the Project with Docker Compose](#step-6-running-the-project-with-docker-compose)
8. [Final Project Testing](#step-7-final-project-testing)
9. [Troubleshooting and Additional Notes](#step-8-troubleshooting-and-additional-notes)

## Step 0: Installing Docker and Docker Compose

If you haven't installed Docker yet, you can use the following links to install it:

- For Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- For macOS: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- For Linux: [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

After installation, verify the installation by running the following commands:

```bash
docker --version
docker-compose --version
```

## Step 1: Setting up the Backend Project (Node.js)

First, let's create a folder for the entire project and then separate folders for the backend and frontend:

```bash
mkdir docker-nodejs-vue-project
cd docker-nodejs-vue-project
mkdir backend
cd backend
```

### Creating an Express Project

1. Create a `package.json` file:

```bash
npm init -y
```

2. Install the required packages:

```bash
npm install express cors
npm install --save-dev nodemon
```

3. Create an `index.js` file with the following content:

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend server!', timestamp: new Date() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
```

4. Update the `scripts` section in the `package.json` file:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

5. Test running the backend:

```bash
npm run dev
```

You should now be able to access the JSON response by visiting `http://localhost:3000/api/hello`.

## Step 2: Setting up the Frontend Project (Vue.js)

Now go back to the main project folder and create the Vue.js project:

```bash
cd ..
mkdir frontend
cd frontend
```

### Creating a Vue.js Project

1. Use Vue CLI to create a new project (if you don't have Vue CLI installed, first install it with the command `npm install -g @vue/cli`):

```bash
vue create .
```

During project creation, you can select the default options or customize the settings according to your needs.

2. Replace the `src/App.vue` file with the following code:

```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>Dockerized Vue.js and Node.js Project</h1>
  
    <div class="card">
      <button @click="fetchData">Get Message from Backend</button>
    
      <div v-if="loading" class="loading">Loading...</div>
    
      <div v-if="response" class="response">
        <h3>Response from server:</h3>
        <p>{{ response.message }}</p>
        <p class="timestamp">Time: {{ response.timestamp }}</p>
      </div>
    
      <div v-if="error" class="error">
        <p>Error connecting to server: {{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      response: null,
      loading: false,
      error: null,
      // Backend API address - this value will change in the Docker environment
      apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000'
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await fetch(`${this.apiUrl}/api/hello`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        this.response = await response.json();
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching data:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.card {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.loading {
  margin: 20px 0;
  color: #666;
}

.response {
  margin: 20px 0;
  text-align: left;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.timestamp {
  font-size: 0.8em;
  color: #666;
}

.error {
  margin: 20px 0;
  color: #d9534f;
  padding: 10px;
  background-color: #f9f2f2;
  border-radius: 4px;
}
</style>
```

3. Create a `.env.development` file in the frontend root folder with the following content:

```
VUE_APP_API_URL=http://localhost:3000
```

4. Create a `.env.production` file in the frontend root folder with the following content:

```
VUE_APP_API_URL=http://backend:3000
```

Note that in the production environment, we use the service name `backend` instead of `localhost`, which will be defined in the docker-compose file.

5. Test running the frontend:

```bash
npm run serve
```

You should now be able to see the frontend page by visiting `http://localhost:8080`.

## Step 3: Creating a Dockerfile for the Backend

Now go back to the backend folder and create a file named `Dockerfile`:

```bash
cd ../backend
```

Content of the `Dockerfile`:

```dockerfile
# Use the official Node.js image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
```

## Step 4: Creating a Dockerfile for the Frontend

Now go back to the frontend folder and create a file named `Dockerfile`:

```bash
cd ../frontend
```

Content of the `Dockerfile`:

```dockerfile
# Build stage
FROM node:14-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the application for production
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy the built files from the previous stage to the appropriate nginx folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the nginx configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
```

Now create an `nginx.conf` file in the same frontend folder:

```
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Cache settings for static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

## Step 5: Creating the docker-compose.yml File

Now go back to the main project folder and create a file named `docker-compose.yml`:

```bash
cd ..
```

Content of the `docker-compose.yml` file:

```yaml
version: '3'

services:
  # Backend service
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

  # Frontend service
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

# Define network
networks:
  app-network:
    driver: bridge
```

## Step 6: Running the Project with Docker Compose

Now you can run the project using Docker Compose:

```bash
docker-compose up --build
```

This command builds the Docker images and runs the containers. The `--build` parameter ensures that the images are rebuilt each time.

To run the project in the background, you can use the `-d` parameter:

```bash
docker-compose up --build -d
```

To view the logs:

```bash
docker-compose logs -f
```

To stop the project:

```bash
docker-compose down
```

## Step 7: Final Project Testing

After successfully running the project with Docker Compose, you can test it:

1. In your browser, go to `http://localhost` (note that port 80 is the default and doesn't need to be specified).
2. You will see the Vue.js frontend page.
3. Click on the "Get Message from Backend" button.
4. You should see the message received from the backend server.

## Step 8: Troubleshooting and Additional Notes

### Common Issues and Solutions

1. **Backend API Access Issues**:

   - Make sure that in the production environment, the API address is correctly set to `http://backend:3000`.
   - Check that both services are connected to the `app-network` network.
2. **CORS Error**:

   - Make sure the `cors` package in the backend is properly configured.
3. **Changes Not Applied**:

   - After each code change, you need to rebuild the Docker images:
     ```bash
     docker-compose down
     docker-compose up --build
     ```

### Advanced Optimizations

1. **Using Docker Volumes for Development**:

   For continuous development without the need to frequently rebuild images, you can use volumes:

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
2. **Using Different Environments**:

   You can create different docker-compose files for development and production environments:

   - `docker-compose.yml` (default)
   - `docker-compose.dev.yml` (for development)
   - `docker-compose.prod.yml` (for production)

   And run them with the following command:

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

### Environment Variables Table

| Service   | Variable       | Development Value        | Production Value         | Description                 |
| --------- | -------------- | ------------------------ | ------------------------ | --------------------------- |
| Backend   | PORT           | 3000                     | 3000                     | Express server port         |
| Backend   | NODE_ENV       | development              | production               | Node.js environment         |
| Frontend  | VUE_APP_API_URL| http://localhost:3000    | http://backend:3000      | Backend API address         |

## Conclusion

In this guide, you learned how to set up a complete project including a Node.js (Express) backend and Vue.js frontend using Docker and Docker Compose. These skills will help you run your projects in different environments with minimal configuration and benefit from microservice architecture.

By using Docker, you can ensure that your application runs the same way in any environment, and you don't need to worry about differences between different environments.

## Additional Resources

- [Official Docker Documentation](https://docs.docker.com/)
- [Official Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Vue.js Documentation](https://vuejs.org/guide/introduction.html)