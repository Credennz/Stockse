const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
// const cron = require("node-cron");
// Create an Express app
const app = express();
const port = 5001;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to enable CORS
app.use(cors());

// Set up the body parser for JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stock", // Ensure database name is correct
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// Create 'userdata' table if it doesn't exist
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS userdata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    referredBy VARCHAR(255),
    investedAmount DECIMAL(10, 2),
    investmentDate DATE,
    returnPOC VARCHAR(255),
    pocNumber VARCHAR(255),
    dueDate DATE,
    timeInterval VARCHAR(255),
    agreementFile VARCHAR(255),
    paymentStatus VARCHAR(50),
    payoutAmount DECIMAL(10, 2)
  );
`;

const createPayoutTableQuery = `
  CREATE TABLE IF NOT EXISTS monthly_payouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  payout_month VARCHAR(7),  -- Format: YYYY-MM
  name VARCHAR(255),
  paymentStatus VARCHAR(50),
  payoutAmount DECIMAL(10, 2),
  invested_amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES userdata(id)
);

`;

db.query(createUserTableQuery, (err) => {
  if (err) throw err;
  console.log("Userdata table created or already exists.");
});

db.query(createPayoutTableQuery, (err) => {
  if (err) throw err;
  console.log("Monthly payouts table created or already exists.");
});

// API: Fetch all usersSELECT userdata.*, monthly_payouts.payment_status FROM userdata INNER JOIN monthly_payouts ON userdata.id = monthly_payouts.user_id;
app.get("/api/users", (req, res) => {
  const query = "SELECT userdata.*, monthly_payouts.payment_status FROM userdata INNER JOIN monthly_payouts ON userdata.id = monthly_payouts.user_id WHERE monthly_payouts.payout_month = DATE_FORMAT(CURRENT_DATE(), '%Y-%m');";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Failed to fetch users." });
    }
    res.status(200).json(results);
  });
});

// API: Add a new user
app.post("/api/users", upload.single("agreementFile"), (req, res) => {
  const {
    name,
    email,
    password, // Plaintext password directly
    phone,
    address,
    referredBy,
    investedAmount,
    investmentDate,
    returnPOC,
    pocNumber,
    dueDate,
    timeInterval,
    paymentStatus, // Payment status included here
  } = req.body;

  const agreementFile = req.file ? req.file.filename : null;

  const query = "INSERT INTO userdata SET ?";
  const values = {
    name,
    email,
    password, // Store the plaintext password directly
    phone,
    address,
    referredBy,
    investedAmount,
    investmentDate,
    returnPOC,
    pocNumber,
    dueDate,
    timeInterval,
    paymentStatus: paymentStatus || "pending", // Default value if not provided
    agreementFile,
  };

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "User added successfully." });
  });
});


// API: Update user data
app.put("/api/users/:id", upload.single("agreementFile"), (req, res) => {
  const userId = req.params.id;
  const {
    name,
    email,
    password,  // Plain text password
    phone,
    address,
    referredBy,
    investedAmount,
    investmentDate,
    returnPOC,
    pocNumber,
    dueDate,
    timeInterval,
    paymentStatus,  // paymentStatus included here
  } = req.body;

  // If password is provided, use it; otherwise, keep the existing password
  const newPassword = password || undefined;
  const agreementFile = req.file ? req.file.filename : null;

  // Update query
  const query = `
    UPDATE userdata 
    SET 
      name = ?, 
      email = ?, 
      password = ?, 
      phone = ?, 
      address = ?, 
      referredBy = ?, 
      investedAmount = ?, 
      investmentDate = ?, 
      returnPOC = ?, 
      pocNumber = ?, 
      dueDate = ?, 
      timeInterval = ?, 
      paymentStatus = ?, 
      agreementFile = ? 
    WHERE id = ?`;

  const values = [
    name,
    email,
    newPassword,  // Use the plain text password
    phone,
    address,
    referredBy,
    investedAmount,
    investmentDate,
    returnPOC,
    pocNumber,
    dueDate,
    timeInterval,
    paymentStatus || "pending",  // Default to "pending" if not provided
    agreementFile,
    userId,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Failed to update user." });
    }

    res.status(200).json({ message: "User updated successfully." });
  });
});


// API: Delete a user
// API: Delete a user
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  // First, delete the related records in monthly_payouts
  const deletePayoutsQuery = "DELETE FROM monthly_payouts WHERE user_id = ?";
  db.query(deletePayoutsQuery, [userId], (err) => {
    if (err) {
      console.error("Error deleting related payouts:", err);
      return res.status(500).json({ error: "Failed to delete related payouts." });
    }

    // Now, delete the user from userdata
    const query = "DELETE FROM userdata WHERE id = ?";
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Failed to delete user." });
      }

      res.status(200).json({ message: "User and related payouts deleted successfully." });
    });
  });
});


// API: User Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM userdata WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Internal server error." });
      }

      if (isMatch) {
        return res.status(200).json({
          message: "Login successful",
          userId: user.id,
          userData: user,
        });
      } else {
        return res.status(401).json({ message: "Invalid email or password." });
      }
    });
  });
});

/////


const cron = require('node-cron');

cron.schedule('0 0 1 * *', () => {
  axios.post('http://localhost:5001/api/populate-payouts')
    .then(response => console.log('Monthly payouts populated:', response.data))
    .catch(error => console.error('Error populating payouts:', error));
});


//////
///muserlist backend
// Fetch all payouts
app.get("/api/payoutsdata", (req, res) => {
  const query = "SELECT * FROM monthly_payouts ORDER BY payout_amount ASC";

  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching payouts:", err);
          return res.status(500).json({ error: "Failed to fetch payouts." });
      }
      res.status(200).json(results);
  });
});

app.get('/api/payoutssdata', (req, res) => {
  // SQL query to get payment status, name, and id
  const query = `
    SELECT mp.payment_status, u.name, u.id 
    FROM monthly_payouts mp
    JOIN userdata u ON mp.user_id = u.id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching payout data:", err);
      return res.status(500).json({ error: "Failed to fetch payout data." });
    }
    res.status(200).json(results); // Return the results as JSON
  });
});
// **Add New User and Create Payout Entry**

// Populate monthly_payouts table from userdata
app.post("/api/populate-payouts", (req, res) => {
  const nextMonthDate = new Date();
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  const nextMonth = nextMonthDate.toISOString().slice(0, 7);

  const query = `
    INSERT INTO monthly_payouts (user_id, name, invested_amount, investment_date, payout_month, payment_status, payout_amount)
    SELECT id, name, investedAmount, investmentDate, ?, 'Pending', investedAmount * 0.05
    FROM userdata
    WHERE id NOT IN (
      SELECT user_id FROM monthly_payouts WHERE payout_month = ?
    )
  `;

  db.query(query, [nextMonth, nextMonth], (err, results) => {
    if (err) {
      console.error("Error populating payouts for next month:", err);
      return res.status(500).json({ error: "Failed to populate payouts for next month." });
    }
    res.status(200).json({ message: "Test payouts for next month populated successfully." });
  });
});


// Fetch payouts
app.get("/api/payouts", (req, res) => {
  const { year, month } = req.query;
  const targetMonth = `${year}-${month}`;

  const query = `
    SELECT mp.*, u.investedAmount AS user_invested_amount
    FROM monthly_payouts mp
    JOIN userdata u ON mp.user_id = u.id
    WHERE mp.payout_month = ?
  `;

  db.query(query, [targetMonth], (err, results) => {
    if (err) {
      console.error("Error fetching payouts:", err);
      return res.status(500).json({ error: "Failed to fetch payouts." });
    }
    res.status(200).json(results);
  });
});

// Update payout and sync with userdata
// app.put("/api/payouts/:id", (req, res) => {
//   const { id } = req.params;
//   const { payout_amount, payment_status, invested_amount } = req.body;

//   const updatePayoutQuery = `
//     UPDATE monthly_payouts
//     SET payout_amount = ?, payment_status = ?, invested_amount = ?
//     WHERE id = ?
//   `;

//   const updateUserQuery = `
//     UPDATE userdata
//     SET investedAmount = ?
//     WHERE id = (SELECT user_id FROM monthly_payouts WHERE id = ?)
//   `;

//   db.query(updatePayoutQuery, [payout_amount, payment_status, invested_amount, id], (err) => {
//     if (err) {
//       console.error("Error updating payout:", err);
//       return res.status(500).json({ error: "Failed to update payout." });
//     }

//     db.query(updateUserQuery, [invested_amount, id], (err) => {
//       if (err) {
//         console.error("Error updating userdata:", err);
//         return res.status(500).json({ error: "Failed to update userdata." });
//       }
//       res.status(200).json({ message: "Payout and userdata updated successfully." });
//     });
//   });
// });
app.put("/api/payouts/:id", (req, res) => {
  const { id } = req.params;
  const { payout_amount, payment_status } = req.body;

  const updatePayoutQuery = `
    UPDATE monthly_payouts
    SET payout_amount = ?, payment_status = ?
    WHERE id = ?
  `;

  // Update only payout_amount and payment_status in monthly_payouts
  db.query(updatePayoutQuery, [payout_amount, payment_status, id], (err) => {
    if (err) {
      console.error("Error updating payout:", err);
      return res.status(500).json({ error: "Failed to update payout." });
    }

    res.status(200).json({ message: "Payout updated successfully." });
  });
});


// Delete payout
app.delete("/api/payouts/:id", (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM monthly_payouts WHERE id = ?`;

  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting payout:", err);
      return res.status(500).json({ error: "Failed to delete payout." });
    }
    res.status(200).json({ message: "Payout deleted successfully." });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
