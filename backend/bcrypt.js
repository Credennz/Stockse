const bcrypt = require('bcryptjs');

// Example to hash a password
const password = 'userpassword'; // The plain text password
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) throw err;

  console.log('Hashed Password:', hashedPassword);
  // Save the hashed password into the database
});
