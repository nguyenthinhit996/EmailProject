// initData.js
import sequelize from '../database.js';
import User from '../model/User.js';

const initUsers = async () => {
  await sequelize.sync({ alter: true });

  const users = [
    { username: 'john_doe', email: 'john_doe@example.com', password: 'password123' },
    { username: 'jane_doe', email: 'jane_doe@example.com', password: 'password123' },
    { username: 'alice_smith', email: 'alice_smith@example.com', password: 'password123' },
    { username: 'bob_johnson', email: 'bob_johnson@example.com', password: 'password123' },
    { username: 'charlie_brown', email: 'charlie_brown@example.com', password: 'password123' },
  ];

  for (const user of users) {
    await User.create(user);
  }

  console.log('Dummy data inserted successfully.');
  process.exit();
};

initUsers().catch(err => {
  console.error('Error inserting dummy data:', err.message);
  process.exit(1);
});
