const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient ,ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Endpoint สำหรับการล็อกอิน
app.post('/api/login', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('mydb');
    const collection = database.collection('users');

    const { username, password } = req.body;

    console.log(username, password);

    const user = await collection.findOne({ username, password });

    if (user) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint สำหรับการสร้างผู้ใช้
app.post('/api/users', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('mydb');
    const collection = database.collection('users');

    const { fname, lname, username, password } = req.body;

    // ตรวจสอบว่ามี username นี้ในระบบแล้วหรือไม่
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // สร้างผู้ใช้ใหม่
    const newUser = { fname, lname, username, password };
    await collection.insertOne(newUser);

    res.json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
app.get('/api/users', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('mydb');
    const collection = database.collection('users');

    const users = await collection.find().toArray();

    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint สำหรับดึงข้อมูลผู้ใช้แบบเจาะจงตาม user._id
app.get('/api/users/:id', async (req, res) => {
    try {
      await client.connect();
  
      const database = client.db('mydb');
      const collection = database.collection('users');
  
      const userId = req.params.id;
  
      // แก้ไขจากการใช้ ObjectId(userId) เป็น new ObjectId(userId)
      const user = await collection.findOne({ _id: new ObjectId(userId) });
  
      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  });

  
  // Endpoint สำหรับอัพเดตผู้ใช้
  app.put('/api/users/:id', async (req, res) => {
    try {
      await client.connect();
  
      const database = client.db('mydb');
      const collection = database.collection('users');
  
      const userId = req.params.id;
      const { fname, lname, username, password } = req.body;
  
      // ตรวจสอบว่ามี user นี้ในระบบหรือไม่
      const existingUser = await collection.findOne({ _id: new ObjectId(userId) });
  
      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // ตรวจสอบว่ามี username นี้ในระบบหรือไม่ (ไม่ให้ใช้ username ที่มีคนใช้แล้ว)
      const isUsernameTaken = await collection.findOne({ username, _id: { $ne: new ObjectId(userId) } });
  
      if (isUsernameTaken) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }
  
      // อัพเดตข้อมูลผู้ใช้
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { fname, lname, username, password } }
      );
  
      res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  });  

// Endpoint สำหรับลบผู้ใช้
app.delete('/api/users/:id', async (req, res) => {
    try {
      await client.connect();
  
      const database = client.db('mydb');
      const collection = database.collection('users');
  
      const userId = req.params.id;
  
      // ตรวจสอบว่ามี user นี้ในระบบหรือไม่
      const existingUser = await collection.findOne({ _id: new ObjectId(userId) });
  
      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // ลบผู้ใช้
      await collection.deleteOne({ _id: new ObjectId(userId) });
  
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      await client.close();
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
