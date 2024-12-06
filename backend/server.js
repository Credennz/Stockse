require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const multer = require('multer');
// Configure multer storage (choose memoryStorage or diskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the folder to store the files
  },
  filename: (req, file, cb) => {
      // Set the filename for the uploaded file
      cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const upload = multer({ storage: storage });


// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // console.log('Login attempt:', { email, password });  // Log incoming data

  try {
    // Step 1: Check the admin (users table)
    const [adminResults] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    // console.log('Admin query result:', adminResults);  // Log the result from the query

    if (adminResults.length > 0) {
      const admin = adminResults[0];
      // console.log('Admin found:', admin);  // Log the admin data

      // Compare passwords (replace with bcrypt comparison in production)
      if (password === admin.password) {
        return res.json({
          role: 'admin',
          userId: admin.id,
          message: 'Welcome, Admin!',
        });
      } else {
        console.log('Admin password mismatch');  // Log if password is incorrect
        return res.status(401).json({ message: 'Incorrect password for admin.' });
      }
    }

    // Step 2: If not an admin, check the regular user (userdata table)
    const [userResults] = await pool.execute('SELECT * FROM userdata WHERE email = ?', [email]);
    // console.log('User query result:', userResults);  // Log the result from the user query

    if (userResults.length > 0) {
      const user = userResults[0];
      // console.log('User found:', user);  // Log the user data

      // Compare passwords (replace with bcrypt comparison in production)
      if (password === user.password) {
        return res.json({
          role: 'user',
          userId: user.id,
          userData: user,
          message: 'Welcome to the User Panel!',
        });
      } else {
        console.log('User password mismatch');  // Log if password is incorrect
        return res.status(401).json({ message: 'Incorrect password for user.' });
      }
    }

    // Step 3: If not found in both tables
    console.log('No user or admin found');  // Log if email is not found in both tables
    return res.status(401).json({ message: 'Invalid email or password' });

  } catch (error) {
    console.error('Login error:', error);  // Log any unexpected errors
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// User Dashboard Data Route
// User Dashboard Data Route
app.get('/user-dashboard/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch user details with explicit column selection
    const [userDetails] = await pool.execute(
      'SELECT id, name,investmentDate, COALESCE(investedAmount, 0) as investedAmount FROM userdata WHERE id = ?', 
      [userId]
    );
    
    if (userDetails.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch monthly payouts
    const [monthlyPayouts] = await pool.execute(
      'SELECT * FROM monthly_payouts WHERE user_id = ?', 
      [userId]
    );

    // Calculate Total Payout
    const totalPayout = monthlyPayouts.reduce((sum, payout) => 
      sum + parseFloat(payout.payout_amount), 0);

    // Calculate ROI
    const initialInvestment = parseFloat(userDetails[0].investedAmount);
    const roiTillDate = initialInvestment > 0 
      ? ((totalPayout / initialInvestment) * 100).toFixed(2) 
      : '0.00';

    // Prepare Dashboard Data
    const dashboardData = {
      userInfo: userDetails[0],
      monthlyPayouts: monthlyPayouts,
      totalPayout: totalPayout.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }),
      roiTillDate: roiTillDate
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data retrieval error:', error);
    res.status(500).json({ 
      message: 'Error retrieving dashboard data',
      error: error.message 
    });
  }
});

/// news data   

app.post('/api/news', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const image = req.files && req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
  const video = req.files && req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;

  try {
    const [result] = await pool.execute(
      'INSERT INTO news (title, content, image, video) VALUES (?, ?, ?, ?)',
      [title, content, image, video]
    );
    res.status(201).json({ id: result.insertId, message: 'News created successfully' });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Error creating news', error: error.message });
  }
});

app.put('/api/news/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  const { title, content } = req.body;
  const id = req.params.id;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  let image = req.body.image || null;
  let video = req.body.video || null;

  if (req.files) {
    if (req.files['image']) {
      image = `/uploads/${req.files['image'][0].filename}`;
    }
    if (req.files['video']) {
      video = `/uploads/${req.files['video'][0].filename}`;
    }
  }

  try {
    const [result] = await pool.execute(
      'UPDATE news SET title = ?, content = ?, image = ?, video = ? WHERE id = ?',
      [title, content, image, video, id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'News updated successfully' });
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Error updating news', error: error.message });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM news WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'News deleted successfully' });
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error: error.message });
  }
});

app.get('/api/new', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title FROM news ORDER BY created_at DESC LIMIT 5');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

app.get('/api/titles', async (req, res) => {
  try {
    // Query to select only the 'title' column for all rows in the news table
    const [rows] = await pool.query('SELECT title FROM news ORDER BY created_at DESC');

    res.json(rows); // Send the rows containing all titles as a JSON response
  } catch (error) {
    console.error('Error fetching news titles:', error);
    res.status(500).json({ message: 'Error fetching news titles', error: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 