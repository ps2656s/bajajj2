const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // For handling file uploads
const cors = require('cors'); // Importing CORS middleware

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  credentials: true
})); // Enable CORS for all routes and origins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to validate if a string is base64
const isBase64 = (str) => {
  const notBase64 = /[^A-Z0-9+\/=]/i;
  const len = str.length;
  if (!len || len % 4 !== 0 || notBase64.test(str)) return false;
  const firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || (firstPaddingChar === len - 2 && str[len - 1] === '=');
};

// POST method for /bfhl
app.post('/bfhl', upload.single('file_b64'), (req, res) => {
  const { data, file_b64 } = req.body;
  const user_id = "john_doe_17091999";
  const email = "john@xyz.com";
  const roll_number = "ABCD123";

  // Separate numbers and alphabets
  let numbers = [];
  let alphabets = [];
  let highest_lowercase_alphabet = [];

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (isNaN(item)) {
      alphabets.push(item);
      if (item >= 'a' && item <= 'z') {
        highest_lowercase_alphabet.push(item);
      }
    }
  });

  // Find the highest lowercase alphabet
  if (highest_lowercase_alphabet.length > 0) {
    highest_lowercase_alphabet = [highest_lowercase_alphabet.sort().reverse()[0]];
  }

  // File validation
  let file_valid = false;
  let file_mime_type = null;
  let file_size_kb = 0;

  if (file_b64 && isBase64(file_b64)) {
    file_valid = true;

    // Simulate file MIME type and size extraction (in a real app, this would be decoded)
    file_mime_type = "image/png"; // You can set this based on the actual decoded file
    file_size_kb = (Buffer.byteLength(file_b64, 'base64') / 1024).toFixed(2);
  }

  // Return response
  res.status(200).json({
    is_success: true,
    user_id: user_id,
    email: email,
    roll_number: roll_number,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highest_lowercase_alphabet,
    file_valid: file_valid,
    file_mime_type: file_mime_type,
    file_size_kb: file_size_kb
  });
});

// GET method for /bfhl
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
