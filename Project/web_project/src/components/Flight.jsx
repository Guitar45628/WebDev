import React, { useState, useEffect } from 'react';
import axios from 'axios'; // หรือ import fetch from 'node-fetch';

function Flight() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.0.232:8000/getuser');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>User Data</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <p>ID: {user.id}</p>
            <p>Name: {user.firstname} {user.lastname}</p>
            <p>Age: {user.age}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Flight;
