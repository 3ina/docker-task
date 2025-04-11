<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>پروژه داکرایز شده Vue.js و Node.js</h1>
  
    <div class="card">
      <button @click="fetchData">دریافت پیام از بک‌اند</button>
  
      <div v-if="loading" class="loading">در حال بارگذاری...</div>
  
      <div v-if="response" class="response">
        <h3>پاسخ از سرور:</h3>
        <p>{{ response.message }}</p>
        <p class="timestamp">زمان: {{ response.timestamp }}</p>
      </div>
  
      <div v-if="error" class="error">
        <p>خطا در ارتباط با سرور: {{ error }}</p>
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
      // آدرس API بک‌اند - این مقدار در محیط داکر تغییر خواهد کرد
      apiUrl: 'http://localhost:3000'
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
  
      try {
        const response = await fetch(`${this.apiUrl}/api/hello`);
        if (!response.ok) {
          throw new Error(`خطای HTTP: ${response.status}`);
        }
        this.response = await response.json();
      } catch (err) {
        this.error = err.message;
        console.error('خطا در دریافت داده:', err);
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
  direction: rtl;
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
  text-align: right;
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
