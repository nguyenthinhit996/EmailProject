import express from 'express';
import dotenv from 'dotenv';
import sequelize from './database.js';
import userRoutes from './routes/userRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', userRoutes);
app.use('/api', emailRoutes);


// Authenticate the connection and sync the database
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // Sync the User model with the database
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database or synchronize:', err.message);
    console.error(err);
  });
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
