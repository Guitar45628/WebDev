const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'socialbook';
const collectionName = 'users'; // Change collection name to 'users'

let db;

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Endpoint for user login
app.post('/login', async (req, res) => {
    try {
      await client.connect();
  
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
  
      const { usernameOrEmail, password } = req.body; // เปลี่ยนตรงนี้
  
      // Find user by username or Email
      const user = await collection.findOne({
        $or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      });
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  
      // Compare passwords directly
      if (password !== user.password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      res.json({ success: true, message: 'Login successful', user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
});



// Endpoint for user registration
app.post('/register', async (req, res) => {
  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const { username, password, email, firstname, lastname } = req.body;

    // Check if username or email already exists in the database
    const existingUser = await collection.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    // Create a new user
    const newUser = { username, password, email, firstname, lastname };
    await collection.insertOne(newUser);

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    await client.close();
  }
});

// Start the server after the database connection is established
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
