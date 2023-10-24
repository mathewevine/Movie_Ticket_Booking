const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


const dbConfig = {
  host: "localhost",
  user: "root",
  password: "E ine.@12",
  database: 'movie_ticket_booking'
};


const pool = mysql.createPool(dbConfig);

app.get('/seats', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM tickets_info');
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching seat data:', err);
    res.status(500).json({ error: 'Failed to retrieve seat data' });
  }
});

app.post('/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    const seats = bookingData;

    // Inserting booking data into the database
    const connection = await pool.getConnection();
    const seatNumbers = seats.join("','"); 
    const query = `UPDATE tickets_info SET Availability = 'booked' WHERE seatNo IN ('${seatNumbers}')`;
    await connection.query(query);

    connection.release();
    res.json({ message: 'Booking successful' });
  } catch (err) {
    console.error('Error booking seats:', err);
    res.status(500).json({ error: 'Failed to book seats' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});