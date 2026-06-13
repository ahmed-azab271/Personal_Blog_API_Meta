require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const { initDB } = require('./utils/db');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;

// Initialize database then start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
