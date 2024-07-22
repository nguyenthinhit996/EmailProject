import User from "../model/User.js";

export const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

export const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await User.create({ username, email, password });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};