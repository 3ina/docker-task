const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// میان‌افزارها (Middlewares)
app.use(cors());
app.use(express.json());

// مسیرها (Routes)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'سلام از سرور بک‌اند!', timestamp: new Date() });
});

// شروع سرور
app.listen(PORT, () => {
  console.log(`سرور بک‌اند روی پورت ${PORT} در حال اجراست`);
});