require('dotenv').config(); 
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
app.use(bodyParser.json());

// PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // Use true for production with verified certificates
    },
});
  
// Function to create the table if it does not exist
const initializeDatabase = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        branch_type VARCHAR(100),
        delivery_status VARCHAR(100),
        circle VARCHAR(100),
        district VARCHAR(100),
        division VARCHAR(100),
        region VARCHAR(100),
        block VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        pincode VARCHAR(10)
      );
    `;
  
    try {
      await pool.query(createTableQuery);
      console.log('Database initialized: Table "locations" is ready.');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };
  

// API to store data
app.post('/api/favourites', async (req, res) => {
    const {
      Name,
      Description,
      BranchType,
      DeliveryStatus,
      Circle,
      District,
      Division,
      Region,
      Block,
      State,
      Country,
      Pincode,
    } = req.body;
  
    console.log(Name)

    try {
      const result = await pool.query(
        `INSERT INTO locations (name, description, branch_type, delivery_status, circle, district, division, region, block, state, country, pincode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [Name, Description, BranchType, DeliveryStatus, Circle, District, Division, Region, Block, State, Country, Pincode]
      );
      res.status(201).json({
        message: 'Location added successfully',
        location: result.rows[0],
      });
    } catch (error) {
      console.error('Error inserting location:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // API to fetch all data
  app.get('/api/favourites', async (req, res) => {
    try {
      await initializeDatabase()
      const result = await pool.query('SELECT * FROM locations');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  