const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../utils/db');
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

exports.register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const [existingUsers] = await pool.query('SELECT * FROM Users WHERE email = ?', [validatedData.email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const [result] = await pool.query(
      'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
      [validatedData.name, validatedData.email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Registration Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const [users] = await pool.query('SELECT * FROM Users WHERE email = ?', [validatedData.email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = users[0];

    const isMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, message: 'Logged in successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
