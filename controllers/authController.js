const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Wallet = require('../models/walletModel');

const createNewUser = async (req, res) => {
    const { username, email, password, role, devPassword } = req.body;

    // Validate the input
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    if (role === "admin" && !devPassword) {
        return res.status(403).json({
            message: "Only the developer can create admin users"
        });
    }

    if (role === "admin" && devPassword !== process.env.DEV_PASSWORD) {
        return res.status(400).json({
            message: "Wrong dev password. Do not use this endpoint if not dev."
        });
    }

    // Create a new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Check if a wallet already exists for the user
    const existingWallet = await Wallet.findOne({ userId: savedUser._id });
    if (!existingWallet && role !== "admin") {
        // Create a wallet for the new user
        const newWallet = new Wallet({
            userId: savedUser._id,
            balance: 0,
            transactions: [],
        });

        await newWallet.save();
    }

    res.status(201).json({
        message: 'User successfully created',
        user: savedUser,
    });
};

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    // Validate the input
    if (!email || !password) {
        return res.status(400).json({message: 'All fields are required'});
    }

    // Check if the user exists
    const existingUser = await User.findOne({email});
    if (!existingUser) {
        return res.status(404).json({message: 'User not found'});
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compareSync(password, existingUser.password)
    if (!isPasswordCorrect) {
        return res.status(401).json({message: 'Invalid password'});
    }

    // Generate a JWT token
    const token = jwt.sign({
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
    }, process.env.JWT_SECRET, {expiresIn: '3d'})

    res.status(200).json({
        message: 'Login successful',
        token,
        user: existingUser,
    })
}


module.exports = {
    createNewUser,
    loginUser,
}