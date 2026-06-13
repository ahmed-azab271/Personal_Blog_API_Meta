const { pool } = require('../utils/db');
const { z } = require('zod');

const postSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  content: z.string().min(1, 'Content cannot be empty'),
});

exports.getAllPosts = async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT p.id, p.title, p.content, p.created_at, u.name as author_name, u.email as author_email
      FROM Posts p
      JOIN Users u ON p.authorId = u.id
      ORDER BY p.created_at DESC
    `);
    
    res.status(200).json(posts);
  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const validatedData = postSchema.parse(req.body);

    const [result] = await pool.query(
      'INSERT INTO Posts (title, content, authorId) VALUES (?, ?, ?)',
      [validatedData.title, validatedData.content, req.user.userId]
    );

    const [newPost] = await pool.query('SELECT * FROM Posts WHERE id = ?', [result.insertId]);

    res.status(201).json(newPost[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Create Post Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const validatedData = postSchema.parse(req.body);

    const [posts] = await pool.query('SELECT * FROM Posts WHERE id = ?', [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = posts[0];

    if (post.authorId !== req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: You can only edit your own posts' });
    }

    await pool.query(
      'UPDATE Posts SET title = ?, content = ? WHERE id = ?',
      [validatedData.title, validatedData.content, postId]
    );

    const [updatedPost] = await pool.query('SELECT * FROM Posts WHERE id = ?', [postId]);

    res.status(200).json(updatedPost[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Update Post Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    const [posts] = await pool.query('SELECT * FROM Posts WHERE id = ?', [postId]);

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const post = posts[0];

    if (post.authorId !== req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized: You can only delete your own posts' });
    }

    await pool.query('DELETE FROM Posts WHERE id = ?', [postId]);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
