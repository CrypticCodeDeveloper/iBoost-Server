const Wallet = require('../models/walletModel');
const User = require('../models/userModel')
const VerifiedTransaction = require('../models/verifiedTransactions')

const addFunds = async (req, res) => {
    const { userId, amount, reference } = req.body;

    // Validate userId and amount
    if (!userId || !amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid userId or amount' });
    }

    // Check if the user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Find the wallet
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found for this user' });
    }

    // Update wallet balance and transactions
    wallet.balance += amount;
    wallet.transactions.push({ type: 'credit', amount, description: 'Added funds' });
    await wallet.save();

    // Save the verified transaction
    const verifiedTransaction = new VerifiedTransaction({ referenceString: reference });
    await verifiedTransaction.save();

    res.status(200).json({ message: 'Funds added successfully', wallet });
};

const deductFunds = async (req, res) => {
    const { userId, amount } = req.body;

    const existingUser = await User.findById(userId);
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.balance -= amount;
    wallet.transactions.push({ type: 'debit', amount, description: 'Deducted funds' });
    await wallet.save();

    res.status(200).json({ message: 'Funds deducted successfully', wallet });
};

const getWallet = async (req, res) => {
    const { userId } = req.params;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ wallet });
};

module.exports = { addFunds, deductFunds, getWallet };